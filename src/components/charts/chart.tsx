"use client";

import type { TooltipPayloadEntry } from "recharts";

import { formatExact, type ValueFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Chart color slots, in the tested color-blind-safe order (see --chart-1…5 in globals.css).
 * Give series colors in this order and keep each series on its color, even when others are
 * hidden. More than five series? Group the smallest into "Other".
 */
export type ChartColor = 1 | 2 | 3 | 4 | 5;

export function chartColor(slot: ChartColor): string {
  return `var(--chart-${slot})`;
}

/** Hairline horizontal gridlines, one step off the card. */
export const gridProps = { vertical: false, stroke: "var(--chart-grid)" } as const;

const tickStyle = { fill: "var(--subtle-foreground)", fontSize: 11 } as const;

export const xAxisProps = {
  axisLine: { stroke: "var(--chart-axis)" },
  tickLine: false,
  tick: tickStyle,
  tickMargin: 10,
  minTickGap: 12,
} as const;

export const yAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: tickStyle,
  tickMargin: 8,
  width: "auto",
} as const;

/**
 * Clean y-axis ticks from 0 up to just above the biggest value, in steps of 1, 2, 2.5 or 5
 * (times 10, 100, 1,000…). So 0, 25K, 50K… instead of 0, 45K, 90K…
 */
export function yAxisTicks(max: number, target = 5): number[] {
  if (!(max > 0)) return [0, 1];
  const rough = max / target;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? rough;
  const count = Math.ceil(max / step);
  return Array.from({ length: count + 1 }, (_, index) => index * step);
}

/** The crosshair that follows the pointer on line and area charts. */
export const crosshair = {
  stroke: "var(--subtle-foreground)",
  strokeOpacity: 0.45,
  strokeWidth: 1,
} as const;

/** Every 8px dot gets a 2px ring in the card color so it stays clear where lines cross. */
export function dotStyle(color: string) {
  return { r: 4, fill: color, stroke: "var(--card)", strokeWidth: 2 } as const;
}

/**
 * Picks evenly spaced x-axis labels, counting back from the most recent one so it always shows.
 * Daily data gets one label a week (or every two weeks for longer ranges).
 */
export function pickTicks(labels: readonly string[]): string[] {
  const count = labels.length;
  if (count <= 8) return [...labels];

  const step = count <= 16 ? Math.ceil(count / 4) : count <= 31 ? 7 : count <= 92 ? 14 : 30;
  const picked: string[] = [];
  for (let index = count - 1; index >= 0; index -= step) {
    const label = labels[index];
    if (label !== undefined) picked.unshift(label);
  }
  return picked;
}

/** Sizes a chart and styles Recharts' text to match the rest of the app. */
export function ChartFrame({
  className,
  style,
  height = 220,
  ...props
}: React.ComponentProps<"div"> & { height?: number }) {
  return (
    <div
      data-slot="chart"
      className={cn(
        "relative w-full min-w-0 select-none",
        "[&_.recharts-cartesian-axis-tick-value]:font-mono [&_.recharts-cartesian-axis-tick-value]:tabular-nums",
        "[&_.recharts-surface]:overflow-visible [&_.recharts-surface]:rounded-sm",
        className,
      )}
      style={{ height, ...style }}
      {...props}
    />
  );
}

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadEntry>;
  label?: string | number;
  valueFormat?: ValueFormat;
};

/** Tooltip body: the date, then one row per series. The value leads, the name follows. */
export function ChartTooltipContent({
  active,
  payload,
  label,
  valueFormat = "number",
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  const title = readTooltipLabel(payload[0]?.payload) ?? label;

  return (
    <div className="max-w-72 min-w-36 rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-xl">
      {title !== undefined && (
        <p className="line-clamp-2 text-[11px] text-subtle-foreground">{title}</p>
      )}
      <ul className="mt-1 grid gap-1">
        {payload.map((entry) => (
          <li
            key={String(entry.dataKey ?? entry.name)}
            className="flex items-center gap-2 text-[13px] whitespace-nowrap"
          >
            <span
              aria-hidden="true"
              className="h-0.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-semibold tabular-nums">
              {typeof entry.value === "number"
                ? formatExact(entry.value, valueFormat)
                : String(entry.value ?? "")}
            </span>
            <span className="text-muted-foreground">{String(entry.name ?? "")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Data points can carry a longer `tooltipLabel` (e.g. "Sun, Oct 18") for the tooltip title. */
function readTooltipLabel(point: unknown): string | undefined {
  if (typeof point === "object" && point !== null && "tooltipLabel" in point) {
    const value = point.tooltipLabel;
    if (typeof value === "string") return value;
  }
  return undefined;
}

export type ChartLegendItem = {
  name: string;
  color: ChartColor;
  /** Match the mark: a short line for line charts, a square for bars and areas. */
  shape?: "line" | "square";
};

/** Names every series. Charts with two or more series always show one. */
export function ChartLegend({
  items,
  className,
}: {
  items: readonly ChartLegendItem[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={
              item.shape === "square" ? "size-2.5 rounded-[3px]" : "h-0.5 w-3 rounded-full"
            }
            style={{ backgroundColor: chartColor(item.color) }}
          />
          {item.name}
        </li>
      ))}
    </ul>
  );
}
