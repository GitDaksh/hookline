import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { HeaderAccount } from "@/components/auth/header-account";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/site/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChannelSearch } from "@/components/youtube/channel-search";
import { siteConfig } from "@/config/site";

const HERO_LINE_PATH =
  "M0 360 C 160 352 240 316 360 318 S 540 262 640 250 S 840 168 940 140 S 1100 52 1200 24";

export default function HomePage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* Soft Iris glow from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--brand)_14%,transparent),transparent)]"
      />

      {/* The "line" in Hookline: a growth curve that draws itself */}
      <svg
        aria-hidden
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] w-full text-brand"
      >
        <defs>
          <linearGradient id="hero-line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="55%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
          <filter id="hero-line-glow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <path
          className="hero-line"
          d={HERO_LINE_PATH}
          pathLength={1}
          stroke="url(#hero-line-gradient)"
          strokeWidth={6}
          strokeLinecap="round"
          filter="url(#hero-line-glow)"
          opacity={0.5}
        />
        <path
          className="hero-line"
          d={HERO_LINE_PATH}
          pathLength={1}
          stroke="url(#hero-line-gradient)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>

      <header className="flex items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <HeaderAccount />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-8 pb-20 text-center">
        <Badge className="mb-8">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
          </span>
          In development · Free & open source
        </Badge>

        <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          {siteConfig.name}
        </h1>

        <p className="mt-5 text-lg text-muted-foreground sm:text-xl">{siteConfig.tagline}</p>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-pretty text-subtle-foreground">
          {siteConfig.description}
        </p>

        <div className="mt-10 w-full max-w-md">
          <ChannelSearch />
          <p className="mt-3 text-xs text-subtle-foreground">
            Look up any public YouTube channel. Free, and no sign-in needed.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/design/dashboard">
              See the dashboard preview
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              Follow the build on GitHub
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
