import type { Metadata } from "next";
import Link from "next/link";

import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { Logo, LogoMark } from "@/components/brand/logo";
import { SiteFooter } from "@/components/site/site-footer";
import { SkipLink } from "@/components/skip-link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Hookline with your Google account. It's free.",
  alternates: { canonical: "/sign-in" },
  robots: { index: false, follow: true },
};

const linkClass =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground";

export default function SignInPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      {/* Soft Iris glow from the top, like the home page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_oklab,var(--brand)_12%,transparent),transparent)]"
      />
      <SkipLink />

      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Hookline home" className="flex items-center rounded-md">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 flex-col items-center justify-center px-4 py-12 outline-none"
      >
        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-border bg-card px-6 py-8 text-center shadow-xl shadow-black/5 sm:px-8">
            <LogoMark className="mx-auto size-10" />
            <h1 className="mt-5 text-xl font-semibold tracking-tight">Sign in to Hookline</h1>
            <p className="mt-2 text-sm leading-relaxed text-balance text-muted-foreground">
              Save your channel and get your own dashboard. It&apos;s free.
            </p>

            <div className="mt-7">
              <GoogleSignIn />
            </div>

            <p className="mt-6 text-xs leading-relaxed text-pretty text-subtle-foreground">
              By continuing, you agree to the{" "}
              <Link href="/terms" className={linkClass}>
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className={linkClass}>
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-pretty text-muted-foreground">
            Just looking?{" "}
            <Link href="/youtube" className={linkClass}>
              Look up any channel
            </Link>{" "}
            without an account.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
