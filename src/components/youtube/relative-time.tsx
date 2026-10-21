"use client";

import { useSyncExternalStore } from "react";

import { formatFullDate } from "@/lib/youtube/format";

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

// Re-renders once a minute. The snapshot is the current minute, so it stays stable in between.
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}
const currentMinute = () => Math.floor(Date.now() / 60_000);

/** "12 minutes ago". Shows the plain date until the page has loaded in the browser. */
export function RelativeTime({ iso }: { iso: string }) {
  const nowMinute = useSyncExternalStore(subscribe, currentMinute, () => null);
  const label = nowMinute === null ? formatFullDate(iso) : describe(iso, nowMinute);

  return (
    <time dateTime={iso} title={new Date(iso).toUTCString()}>
      {label}
    </time>
  );
}

function describe(iso: string, nowMinute: number) {
  const minutes = nowMinute - Math.floor(Date.parse(iso) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return relative.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return relative.format(-hours, "hour");
  return relative.format(-Math.floor(hours / 24), "day");
}
