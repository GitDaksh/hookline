import type { Metadata } from "next";
import Link from "next/link";
import { ChartColumn, ListVideo, RefreshCw } from "lucide-react";

import { ChannelSearch } from "@/components/youtube/channel-search";

export const metadata: Metadata = {
  title: "YouTube channel lookup",
  description:
    "See subscribers, views and the latest uploads for any public YouTube channel. Free, no sign-in.",
  alternates: { canonical: "/youtube" },
};

const EXAMPLES = ["mkbhd", "veritasium", "kurzgesagt", "ted"];

const FEATURES = [
  {
    icon: ChartColumn,
    title: "Channel numbers",
    text: "Subscribers, total views and how many videos are public.",
  },
  {
    icon: ListVideo,
    title: "The latest 50 uploads",
    text: "Views, likes and comments on every recent video.",
  },
  {
    icon: RefreshCw,
    title: "Fresh every hour",
    text: "Numbers come straight from YouTube and update about once an hour.",
  },
];

export default function ChannelLookupPage() {
  return (
    <div className="relative isolate py-10 sm:py-20">
      {/* Soft Iris glow behind the heading, like the home page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-8 -z-10 h-72 bg-[radial-gradient(45%_60%_at_50%_30%,color-mix(in_oklab,var(--brand)_12%,transparent),transparent)]"
      />

      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Look up any YouTube channel
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-pretty text-muted-foreground">
          Subscribers, views and the latest uploads for any public channel. Free, and no sign-in
          needed.
        </p>

        <ChannelSearch className="mt-8" />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[13px] text-subtle-foreground">Try</span>
          {EXAMPLES.map((handle) => (
            <Link
              key={handle}
              href={`/youtube/${handle}`}
              className="rounded-full border border-border bg-card px-3 py-1 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:border-input hover:text-foreground"
            >
              @{handle}
            </Link>
          ))}
        </div>
      </div>

      <ul className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-3 sm:mt-24 sm:grid-cols-3 sm:gap-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <Icon aria-hidden="true" className="size-4 text-brand" />
            <p className="mt-3 text-sm font-medium">{title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
