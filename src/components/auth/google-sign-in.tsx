"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/hooks/use-theme";
import { getGoogleClientId, getSupabaseConfig } from "@/lib/auth/config";
import { safeNextPath } from "@/lib/auth/redirects";
import { cn } from "@/lib/utils";

const GOOGLE_SCRIPT_URL = "https://accounts.google.com/gsi/client";

// The parts of Google's sign-in library that Hookline uses. Full reference:
// https://developers.google.com/identity/gsi/web/reference/js-reference
type GoogleIdentity = {
  initialize(options: {
    client_id: string;
    callback: (response: { credential?: string }) => void;
    nonce: string;
    context: "signin";
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      type: "standard";
      theme: "outline" | "filled_black";
      size: "large";
      text: "continue_with";
      shape: "rectangular";
      logo_alignment: "center";
      width: number;
    },
  ): void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdentity } };
  }
}

type SignInResult = { ok: true } | { ok: false; message: string };

const TRY_AGAIN = "Sign-in didn't work. Please try again.";

// Google's library should be set up only once per page, so this state lives outside React.
let setup: Promise<GoogleIdentity> | null = null;
let rawNonce: string | null = null;
let onCredential: ((credential: string) => void) | null = null;

/** The "Continue with Google" button, or a note when sign-in isn't set up here. */
export function GoogleSignIn() {
  const clientId = getGoogleClientId();
  if (!clientId || !getSupabaseConfig()) return <NotSetUp />;
  return <GoogleButton clientId={clientId} />;
}

function GoogleButton({ clientId }: { clientId: string }) {
  const buttonTheme = useTheme() === "dark" ? "filled_black" : "outline";
  const buttonRef = useRef<HTMLDivElement>(null);
  const drawnTheme = useRef<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable" | "signing-in">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Load Google's library (again, after "Try again").
  useEffect(() => {
    let active = true;
    setUpGoogle(clientId).then(
      () => active && setStatus("ready"),
      () => active && setStatus("unavailable"),
    );
    return () => {
      active = false;
    };
  }, [clientId, attempt]);

  // Draw Google's button once it's ready, and again only when the theme changes.
  useEffect(() => {
    const container = buttonRef.current;
    const google = window.google?.accounts?.id;
    if (status !== "ready" || !container || !google) return;
    if (drawnTheme.current === buttonTheme && container.childElementCount > 0) return;

    container.replaceChildren();
    google.renderButton(container, {
      type: "standard",
      theme: buttonTheme,
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "center",
      width: Math.round(Math.min(400, Math.max(200, container.clientWidth))),
    });
    drawnTheme.current = buttonTheme;
    // Start loading the sign-in code now, so it's ready the moment someone picks an account.
    void import("@/lib/supabase/client");
  }, [status, buttonTheme]);

  // What happens after someone picks their Google account.
  useEffect(() => {
    onCredential = (credential) => {
      setError(null);
      setStatus("signing-in");
      void signInWithGoogle(credential).then((result) => {
        if (result.ok) {
          // A full page load, so every part of the app sees the new session. Replacing this page
          // means the back button skips the sign-in page.
          const next = new URLSearchParams(window.location.search).get("next");
          window.location.replace(safeNextPath(next));
        } else {
          setError(result.message);
          setStatus("ready");
        }
      });
    };
    return () => {
      onCredential = null;
    };
  }, []);

  if (status === "unavailable") {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Google sign-in couldn&apos;t load. Check your connection, or allow this site in your
          content blocker, then try again.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setStatus("loading");
            setAttempt((count) => count + 1);
          }}
        >
          <RotateCw />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Always the button's height, so nothing jumps while it loads. */}
      <div className="relative h-10">
        <div
          ref={buttonRef}
          className={cn("flex h-10 justify-center", status !== "ready" && "invisible")}
        />
        {status === "loading" && <Skeleton className="absolute inset-0 rounded-md" />}
        {status === "signing-in" && (
          <Button variant="secondary" size="lg" loading className="absolute inset-0 w-full">
            Signing you in…
          </Button>
        )}
      </div>
      <p role="status" className="sr-only">
        {status === "signing-in" ? "Signing you in…" : ""}
      </p>
      {error && (
        <p role="alert" className="text-center text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function NotSetUp() {
  return (
    <div
      role="note"
      className="rounded-md border border-dashed border-border px-4 py-3 text-left text-sm"
    >
      <p className="font-medium">Sign-in isn&apos;t set up here yet</p>
      <p className="mt-1 text-muted-foreground">
        {process.env.NODE_ENV === "development"
          ? "Add the Supabase and Google values to .env.local (see .env.example), then restart the dev server."
          : "This copy of Hookline doesn't have accounts turned on. You can still look up any channel."}
      </p>
    </div>
  );
}

/** Loads Google's library and sets it up, once per page. */
function setUpGoogle(clientId: string): Promise<GoogleIdentity> {
  setup ??= (async () => {
    const google = await loadGoogleScript();
    const nonce = await createNonce();
    rawNonce = nonce.raw;
    google.initialize({
      client_id: clientId,
      // Google signs this into its answer, so the answer can't be replayed somewhere else.
      nonce: nonce.hashed,
      context: "signin",
      callback: (response) => {
        if (response.credential) onCredential?.(response.credential);
      },
    });
    return google;
  })().catch((error: unknown) => {
    setup = null; // so "Try again" starts fresh
    throw error;
  });
  return setup;
}

function loadGoogleScript(): Promise<GoogleIdentity> {
  const loaded = window.google?.accounts?.id;
  if (loaded) return Promise.resolve(loaded);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    let settled = false;
    const finish = (google?: GoogleIdentity) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (google) {
        resolve(google);
      } else {
        script.remove();
        reject(new Error("Google's sign-in script didn't load."));
      }
    };
    const timer = window.setTimeout(() => finish(), 15_000);
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.onload = () => finish(window.google?.accounts?.id);
    script.onerror = () => finish();
    document.head.append(script);
  });
}

/** A random one-time code. Google gets its SHA-256 hash; Supabase gets the code to compare. */
async function createNonce() {
  const raw = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return { raw, hashed };
}

/** Swaps Google's answer for a Hookline session. Supabase saves it in cookies. */
async function signInWithGoogle(credential: string): Promise<SignInResult> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    if (!supabase || !rawNonce) return { ok: false, message: TRY_AGAIN };

    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: credential,
      nonce: rawNonce,
    });
    if (!error) return { ok: true };

    console.error("Sign-in failed:", error.message);
    return {
      ok: false,
      message:
        // A network problem, or Supabase having a moment.
        error.name === "AuthRetryableFetchError"
          ? "Couldn't reach the sign-in service. Please try again in a moment."
          : TRY_AGAIN,
    };
  } catch (error) {
    console.error("Sign-in failed:", error);
    return { ok: false, message: TRY_AGAIN };
  }
}
