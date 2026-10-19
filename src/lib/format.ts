/**
 * Number formatting used across Hookline. Locale is pinned to en-US so the
 * server and the browser always print exactly the same thing.
 */

const wholeNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumSignificantDigits: 3,
});
const percentWhole = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});
const percentOneDecimal = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});
const fixedOneDecimal = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** How a chart or table value should read: a count, or a share like 0.71 → 71%. */
export type ValueFormat = "number" | "percent";

/** The exact value with separators: 72014 → "72,014". */
export function formatNumber(value: number): string {
  return wholeNumber.format(value);
}

/** Short form for tight spots like axis ticks: 950 · 1.2K · 72K · 1.38M. */
export function formatCompact(value: number): string {
  return Math.abs(value) < 1_000 ? wholeNumber.format(value) : compactNumber.format(value);
}

/** Big standalone numbers like stat tiles: 9,412 · 12.9K · 1.38M. */
export function formatStat(value: number): string {
  return Math.abs(value) < 10_000 ? wholeNumber.format(value) : compactNumber.format(value);
}

/** A share as a percent: 0.246 → "24.6%". Pass 0 decimals for "25%". */
export function formatPercent(value: number, decimals: 0 | 1 = 1): string {
  return (decimals === 0 ? percentWhole : percentOneDecimal).format(value);
}

/**
 * The size of a change, always with one decimal so a row of numbers lines up: "8.0%", "24.6%".
 * Use "points" for changes in a percentage: 0.03 → "3.0 pts". The sign is left out.
 */
export function formatChange(value: number, unit: "percent" | "points" = "percent"): string {
  const amount = fixedOneDecimal.format(Math.abs(value) * 100);
  return unit === "points" ? `${amount} pts` : `${amount}%`;
}

/** Axis ticks: compact counts, whole percents. */
export function formatTick(value: number, format: ValueFormat = "number"): string {
  return format === "percent" ? formatPercent(value, 0) : formatCompact(value);
}

/** Tooltips and tables: the exact value. */
export function formatExact(value: number, format: ValueFormat = "number"): string {
  return format === "percent" ? formatPercent(value, 1) : formatNumber(value);
}
