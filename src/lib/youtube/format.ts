const DURATION = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

/** YouTube's ISO 8601 durations ("PT1H2M3S") in seconds, or null if it isn't one. */
export function parseDuration(value: string | undefined): number | null {
  if (!value) return null;
  const match = DURATION.exec(value);
  if (!match) return null;
  const [, days = "0", hours = "0", minutes = "0", seconds = "0"] = match;
  return Number(days) * 86_400 + Number(hours) * 3_600 + Number(minutes) * 60 + Number(seconds);
}

/** 253 → "4:13", 3723 → "1:02:03". */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${ss}` : `${minutes}:${ss}`;
}

// Dates are printed in UTC so the server and the browser always agree.
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const fullDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "Oct 12" */
export function formatShortDate(iso: string): string {
  return shortDate.format(new Date(iso));
}

/** "Oct 12, 2026" */
export function formatFullDate(iso: string): string {
  return fullDate.format(new Date(iso));
}

/** "Mar 2008" */
export function formatMonthYear(iso: string): string {
  return monthYear.format(new Date(iso));
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

/** "IN" → "India". Falls back to the code if it isn't a known region. */
export function countryName(code: string): string {
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}
