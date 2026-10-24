"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getSupabaseConfig, sessionCookieName } from "@/lib/auth/config";
import { cn } from "@/lib/utils";

// Signed in or out in another tab? Look again whenever this tab comes back into view.
function subscribe(onChange: () => void) {
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

/** Whether this browser holds a session. Only a hint for the top bar; pages check properly. */
function hasSession(): boolean {
  const config = getSupabaseConfig();
  if (!config) return false;

  const name = sessionCookieName(config);
  return document.cookie.split(";").some((cookie) => {
    const key = cookie.split("=")[0]?.trim() ?? "";
    return key === name || key.startsWith(`${name}.`);
  });
}

/** "Sign in" for visitors, "Dashboard" for people who are signed in. */
export function HeaderAccount({ className }: { className?: string }) {
  // The server can't see cookies on cached pages, so it leaves a same-size gap to fill in.
  const signedIn = useSyncExternalStore(subscribe, hasSession, () => null);
  const classes = cn("w-24", className);

  if (signedIn === null) return <div aria-hidden="true" className={cn("h-8", classes)} />;

  return signedIn ? (
    <Button asChild variant="secondary" size="sm" className={classes}>
      {/* No prefetch: it would run the sign-in check on every page view. */}
      <Link href="/dashboard" prefetch={false}>
        Dashboard
      </Link>
    </Button>
  ) : (
    <Button asChild size="sm" className={classes}>
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}
