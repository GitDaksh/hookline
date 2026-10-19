"use client";

import { Bar, CartesianGrid, BarChart as RechartsBarChart, Tooltip, XAxis, YAxis } from "recharts";

import {
  ChartFrame,
  ChartTooltipContent,
  chartColor,
  gridProps,
  xAxisProps,
  yAxisProps,
  yAxisTicks,
  type ChartColor,
} from "@/components/charts/chart";
import { formatTick, type ValueFormat } from "@/lib/format";

export type BarChartPoint = {
  /** x-axis label, like "Mon". */
  label: string;
  /** Longer label for the tooltip, like "Mondays". */
  tooltipLabel?: string;
  value: number;
};

type BarChartProps = {
  data: readonly BarChartPoint[];
  /** What the bars measure, like "Average views". */
  name: string;
  /** One sentence for screen readers. */
  description?: string;
  color?: ChartColor;
  valueFormat?: ValueFormat;
  height?: number;
  className?: string;
};

/** Compares one measure across categories. Thin bars, rounded only at the top. */
export function BarChart({
  data,
  name,
  description,
  color = 1,
  valueFormat = "number",
  height = 220,
  className,
}: BarChartProps) {
  const fill = chartColor(color);
  const yTicks = yAxisTicks(Math.max(0, ...data.map((point) => point.value)));

  return (
    <ChartFrame height={height} className={className}>
      <RechartsBarChart
        data={data}
        responsive
        style={{ width: "100%", height: "100%" }}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        aria-label={`${name}, bar chart`}
        desc={description}
      >
        <CartesianGrid {...gridProps} />
        {/* Every bar keeps its label, so keep bar charts to a handful of categories. */}
        <XAxis dataKey="label" interval={0} {...xAxisProps} />
        <YAxis
          {...yAxisProps}
          domain={[0, yTicks[yTicks.length - 1] ?? "auto"]}
          ticks={yTicks}
          tickFormatter={(value: number) => formatTick(value, valueFormat)}
        />
        <Tooltip
          cursor={false}
          isAnimationActive={false}
          content={(props) => <ChartTooltipContent {...props} valueFormat={valueFormat} />}
        />
        <Bar
          dataKey="value"
          name={name}
          fill={fill}
          fillOpacity={0.8}
          activeBar={{ fillOpacity: 1 }}
          maxBarSize={24}
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
      </RechartsBarChart>
    </ChartFrame>
  );
}
