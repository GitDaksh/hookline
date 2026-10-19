"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartFrame,
  ChartTooltipContent,
  chartColor,
  crosshair,
  dotStyle,
  gridProps,
  pickTicks,
  xAxisProps,
  yAxisProps,
  yAxisTicks,
  type ChartColor,
} from "@/components/charts/chart";
import { formatTick, type ValueFormat } from "@/lib/format";

export type AreaChartPoint = {
  /** Short x-axis label, like "Oct 18". Each one must be unique. */
  label: string;
  /** Longer label for the tooltip, like "Sun, Oct 18". */
  tooltipLabel?: string;
  value: number;
};

type AreaChartProps = {
  data: readonly AreaChartPoint[];
  /** What the line measures, like "Views". */
  name: string;
  /** One sentence for screen readers, like "Daily views, rising from 31K to 64K". */
  description?: string;
  color?: ChartColor;
  valueFormat?: ValueFormat;
  height?: number;
  className?: string;
};

/** One measure over time: a 2px line over a soft 10% wash, with the latest point marked. */
export function AreaChart({
  data,
  name,
  description,
  color = 1,
  valueFormat = "number",
  height = 220,
  className,
}: AreaChartProps) {
  const stroke = chartColor(color);
  const lastIndex = data.length - 1;
  const xTicks = pickTicks(data.map((point) => point.label));
  const yTicks = yAxisTicks(Math.max(0, ...data.map((point) => point.value)));

  return (
    <ChartFrame height={height} className={className}>
      <RechartsAreaChart
        data={data}
        responsive
        style={{ width: "100%", height: "100%" }}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        aria-label={`${name}, area chart`}
        desc={description}
      >
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" ticks={xTicks} interval="preserveEnd" {...xAxisProps} />
        <YAxis
          {...yAxisProps}
          domain={[0, yTicks[yTicks.length - 1] ?? "auto"]}
          ticks={yTicks}
          tickFormatter={(value: number) => formatTick(value, valueFormat)}
        />
        <Tooltip
          cursor={crosshair}
          isAnimationActive={false}
          content={(props) => <ChartTooltipContent {...props} valueFormat={valueFormat} />}
        />
        <Area
          type="monotone"
          dataKey="value"
          name={name}
          stroke={stroke}
          strokeWidth={2}
          fill={stroke}
          fillOpacity={0.1}
          isAnimationActive={false}
          activeDot={dotStyle(stroke)}
          dot={(props) =>
            props.index === lastIndex ? (
              <circle cx={props.cx} cy={props.cy} {...dotStyle(stroke)} />
            ) : null
          }
        />
      </RechartsAreaChart>
    </ChartFrame>
  );
}
