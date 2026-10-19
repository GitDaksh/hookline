import { cn } from "@/lib/utils";

const tones = {
  brand: { track: "bg-brand/20", fill: "bg-brand" },
  warning: { track: "bg-warning/20", fill: "bg-warning" },
  danger: { track: "bg-danger/20", fill: "bg-danger" },
} as const;

type MeterProps = React.ComponentProps<"div"> & {
  value: number;
  /** The value that fills the bar. Defaults to 1, so 0.71 reads as 71%. */
  max?: number;
  /** The fill carries the meaning: brand is normal, warning and danger flag a problem. */
  tone?: keyof typeof tones;
};

/** A thin bar for one value against a limit, like hook hold or progress to a goal. */
function Meter({ value, max = 1, tone = "brand", className, ...props }: MeterProps) {
  const percent = max > 0 ? Math.min(Math.max(value / max, 0), 1) * 100 : 0;

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      data-slot="meter"
      className={cn("h-1 w-full overflow-hidden rounded-full", tones[tone].track, className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-smooth",
          tones[tone].fill,
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export { Meter };
