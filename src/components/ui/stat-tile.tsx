import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatChange } from "@/lib/format";
import { cn } from "@/lib/utils";

type StatChange = {
  /** Signed change: 0.246 is up 24.6%, -0.05 is down 5% (or 5 points with `unit: "points"`). */
  value: number;
  /** "percent" for growth like views. "points" for changes in a percentage, like hook hold. */
  unit?: "percent" | "points";
  /** Set to false when going down is good, like skip rate. */
  upIsGood?: boolean;
};

type StatTileProps = React.ComponentProps<"div"> & {
  label: string;
  /** Already formatted, like "1.38M" or "71%". */
  value: string;
  change?: StatChange;
  /** What the change is measured against, like "vs prev. 28 days". */
  comparison?: string;
};

/** One headline number: a label, the value, and how it moved against a named period. */
function StatTile({
  label,
  value,
  change,
  comparison,
  className,
  children,
  ...props
}: StatTileProps) {
  return (
    <Card data-slot="stat-tile" className={cn("min-w-0 gap-0 p-4 sm:p-5", className)} {...props}>
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl leading-none font-semibold tracking-tight">{value}</p>
      {children}
      {change && <StatChangeLine change={change} comparison={comparison} />}
    </Card>
  );
}

function StatChangeLine({ change, comparison }: { change: StatChange; comparison?: string }) {
  const { value, unit = "percent", upIsGood = true } = change;
  const direction = Math.abs(value) < 0.0005 ? "flat" : value > 0 ? "up" : "down";
  const isGood = direction === "flat" ? undefined : (direction === "up") === upIsGood;

  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  const spoken = direction === "up" ? "Up" : direction === "down" ? "Down" : "No change,";

  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-subtle-foreground">
      <Icon
        aria-hidden="true"
        strokeWidth={2.25}
        className={cn(
          "size-3.5 shrink-0",
          isGood === true && "text-success",
          isGood === false && "text-danger",
        )}
      />
      <span className="sr-only">{spoken}</span>
      <span className="font-medium text-foreground">{formatChange(value, unit)}</span>
      {comparison}
    </p>
  );
}

export { StatTile };
export type { StatChange, StatTileProps };
