"use client";

import { useState } from "react";
import { Play, Plus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app-shell/page-header";
import { AreaChart } from "@/components/charts/area-chart";
import { ChartCard } from "@/components/charts/chart-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { StatTile } from "@/components/ui/stat-tile";
import { formatCompact, formatNumber, formatPercent, formatStat } from "@/lib/format";

import { RANGES, rangeSummaries, upNext, type RangeDays } from "../sample-data";

const stageBadge = {
  Scripting: "neutral",
  Editing: "brand",
  Scheduled: "success",
} as const;

function comingSoon(feature: string) {
  toast(`${feature} is coming soon`, {
    description: "This page is a preview with sample data.",
  });
}

export function DashboardPreview() {
  const [range, setRange] = useState<RangeDays>(28);
  const summary = rangeSummaries[range];
  const comparison = `vs prev. ${range} days`;
  const first = summary.days[0];
  const last = summary.days[summary.days.length - 1];

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title="Overview"
        description={`Instagram · last ${range} days · sample data`}
        actions={
          <>
            <SegmentedControl
              aria-label="Date range"
              value={String(range)}
              onValueChange={(value) => {
                const next = RANGES.find((option) => String(option) === value);
                if (next) setRange(next);
              }}
            >
              {RANGES.map((option) => (
                <SegmentedControlItem key={option} value={String(option)}>
                  {option}D
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
            <Button onClick={() => comingSoon("Scripts")}>
              <Plus />
              New script
            </Button>
          </>
        }
      />

      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile
          label="Views"
          value={formatStat(summary.views.value)}
          change={{ value: summary.views.change }}
          comparison={comparison}
        />
        <StatTile
          label="Reach"
          value={formatStat(summary.reach.value)}
          change={{ value: summary.reach.change }}
          comparison={comparison}
        />
        <StatTile
          label="Saves"
          value={formatStat(summary.saves.value)}
          change={{ value: summary.saves.change }}
          comparison={comparison}
        />
        <StatTile
          label="Hook hold"
          value={formatPercent(summary.hookHold.value, 0)}
          change={{ value: summary.hookHold.change, unit: "points" }}
          comparison={comparison}
        >
          <Meter
            value={summary.hookHold.value}
            aria-label="Hook hold"
            aria-valuetext={formatPercent(summary.hookHold.value, 0)}
            className="mt-3"
          />
        </StatTile>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ChartCard
          title="Views per day"
          description={first && last ? `${first.label} – ${last.label}` : undefined}
          table={{
            columns: ["Date", "Views"],
            rows: [...summary.days]
              .reverse()
              .map((day) => [day.fullLabel, formatNumber(day.views)]),
          }}
        >
          <AreaChart
            name="Views"
            description={`Daily views for the last ${range} days, sample data.`}
            data={summary.days.map((day) => ({
              label: day.label,
              tooltipLabel: day.fullLabel,
              value: day.views,
            }))}
          />
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Top reels</CardTitle>
            <CardAction>
              <Button
                variant="link"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => comingSoon("Content")}
              >
                View all
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ol>
              {summary.topReels.map((reel) => (
                <li
                  key={reel.id}
                  className="flex items-center gap-3 border-t border-border py-2.5 first:border-t-0 first:pt-0"
                >
                  <div
                    aria-hidden="true"
                    className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md bg-accent"
                  >
                    <Play className="size-3 text-subtle-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p title={reel.title} className="truncate text-[13px] font-medium">
                      {reel.title}
                    </p>
                    <p className="mt-0.5 text-xs text-subtle-foreground">
                      {formatCompact(reel.views)} views
                    </p>
                  </div>
                  <div className="w-14 shrink-0 text-right">
                    <p className="text-xs font-medium tabular-nums">
                      <span className="sr-only">Hook hold </span>
                      {formatPercent(reel.hookHold, 0)}
                    </p>
                    <Meter value={reel.hookHold} aria-hidden="true" className="mt-1.5" />
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-subtle-foreground">
              Hook hold: share of viewers still watching after 3 seconds.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Up next</CardTitle>
          <CardAction>
            <Button
              variant="link"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => comingSoon("Studio")}
            >
              Open studio
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ul>
            {upNext.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
              >
                <span className="min-w-0 flex-[1_1_16rem] text-[13px] font-medium">
                  {item.title}
                </span>
                <Badge variant={stageBadge[item.stage]} dot>
                  {item.stage}
                </Badge>
                <span className="ml-auto w-24 text-right text-xs text-subtle-foreground">
                  {item.due}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
