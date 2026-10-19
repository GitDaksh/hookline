"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartFrame,
  ChartLegend,
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
import { cn } from "@/lib/utils";

export type LineChartSeries = {
  /** The field in each data point that holds this series' value. */
  key: string;
  /** Name for the legend, tooltip and end label, like "Reels". */
  name: string;
  /** Defaults to the series' position: first series gets color 1, and so on. */
  color?: ChartColor;
};

export type LineChartPoint = {
  /** Short x-axis label. Each one must be unique. */
  label: string;
  /** Longer label for the tooltip. */
  tooltipLabel?: string;
  [seriesKey: string]: string | number | undefined;
};

type LineChartProps = {
  data: readonly LineChartPoint[];
  /** Up to five series. */
  series: readonly LineChartSeries[];
  /** What the chart shows, like "Views by format". Read out by screen readers. */
  title: string;
  description?: string;
  valueFormat?: ValueFormat;
  height?: number;
  /** Name each line at its right end. On by default for up to four series. */
  endLabels?: boolean;
  className?: string;
};

/** Several series over time, with a legend and the lines named at their ends. */
export function LineChart({
  data,
  series,
  title,
  description,
  valueFormat = "number",
  height = 220,
  endLabels = series.length <= 4,
  className,
}: LineChartProps) {
  const lastIndex = data.length - 1;
  const xTicks = pickTicks(data.map((point) => point.label));
  const yTicks = yAxisTicks(
    Math.max(
      0,
      ...data.flatMap((point) =>
        series.map((item) => {
          const value = point[item.key];
          return typeof value === "number" ? value : 0;
        }),
      ),
    ),
  );
  const colored = series.map((item, index) => ({
    ...item,
    color: item.color ?? (Math.min(index + 1, 5) as ChartColor),
  }));
  const order = new Map(colored.map((item, index) => [item.key, index]));
  const longestName = Math.max(0, ...colored.map((item) => item.name.length));

  return (
    <div className={cn("grid gap-4", className)}>
      <ChartLegend items={colored.map(({ name, color }) => ({ name, color }))} />
      <ChartFrame height={height}>
        <RechartsLineChart
          data={data}
          responsive
          style={{ width: "100%", height: "100%" }}
          margin={{ top: 8, right: endLabels ? 16 + longestName * 6.5 : 8, bottom: 0, left: 0 }}
          aria-label={`${title}, line chart`}
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
            itemSorter={(item) => order.get(String(item.dataKey)) ?? 0}
            content={(props) => <ChartTooltipContent {...props} valueFormat={valueFormat} />}
          />
          {colored.map((item) => {
            const stroke = chartColor(item.color);
            return (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={stroke}
                strokeWidth={2}
                isAnimationActive={false}
                activeDot={dotStyle(stroke)}
                dot={(props) =>
                  props.index === lastIndex ? (
                    <g>
                      <circle cx={props.cx} cy={props.cy} {...dotStyle(stroke)} />
                      {endLabels && props.cx !== undefined && (
                        <text
                          x={props.cx + 10}
                          y={props.cy}
                          dy="0.32em"
                          fontSize={11}
                          fill="var(--muted-foreground)"
                        >
                          {item.name}
                        </text>
                      )}
                    </g>
                  ) : null
                }
              />
            );
          })}
        </RechartsLineChart>
      </ChartFrame>
    </div>
  );
}
