import { siteConfig } from "@/config/site";

const HERO_LINE_PATH =
  "M0 360 C 160 352 240 316 360 318 S 540 262 640 250 S 840 168 940 140 S 1100 52 1200 24";

export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      {/* Soft spotlight from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)]"
      />

      {/* The "line" in Hookline: a growth curve that draws itself */}
      <svg
        aria-hidden
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] w-full"
      >
        <defs>
          <linearGradient id="hero-line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fafafa" stopOpacity="0" />
            <stop offset="55%" stopColor="#fafafa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fafafa" stopOpacity="0.9" />
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

      <div className="flex max-w-xl flex-col items-center text-center">
        <span className="mb-8 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-400">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-neutral-300 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-neutral-200" />
          </span>
          In development · Free & open source
        </span>

        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">{siteConfig.name}</h1>

        <p className="mt-5 text-lg text-neutral-300 sm:text-xl">{siteConfig.tagline}</p>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-pretty text-neutral-500">
          {siteConfig.description}
        </p>

        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-neutral-100 transition-colors hover:border-white/20 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200"
        >
          Follow the build on GitHub
          <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-3.5">
            <path
              d="M5 11 11 5M6 5h5v5"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </main>
  );
}
