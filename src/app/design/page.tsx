import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Link2, Plus, Search, TrendingUp } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { AreaChart } from "@/components/charts/area-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartCard } from "@/components/charts/chart-card";
import { LineChart } from "@/components/charts/line-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Meter } from "@/components/ui/meter";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { CommandDemo, ControlsDemo, OverlayDemo, ToastDemo } from "./interactive-demos";
import { rangeSummaries, viewsByFormat, weekdayAverages } from "./sample-data";

export const metadata: Metadata = {
  title: "Design system",
  description: "Hookline's colors, type and components, live in both themes.",
  robots: { index: false, follow: false },
};

const sections = [
  { id: "colors", label: "Colors" },
  { id: "type", label: "Type" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "controls", label: "Controls" },
  { id: "overlays", label: "Overlays" },
  { id: "toasts", label: "Toasts" },
  { id: "command", label: "Command menu" },
  { id: "badges", label: "Badges" },
  { id: "cards", label: "Cards" },
  { id: "stats", label: "Stats" },
  { id: "charts", label: "Charts" },
  { id: "details", label: "Details" },
] as const;

const last28Days = rangeSummaries[28].days;

const formatSeries = [
  { key: "reels", name: "Reels" },
  { key: "carousels", name: "Carousels" },
  { key: "photos", name: "Photos" },
];

const meterTones = [
  { tone: "brand", label: "On track", value: 0.68 },
  { tone: "warning", label: "Getting close", value: 0.86 },
  { tone: "danger", label: "Over the limit", value: 1 },
] as const;

type SwatchItem = { name: string; className: string };

const swatchGroups: { title: string; items: SwatchItem[] }[] = [
  {
    title: "Surfaces",
    items: [
      { name: "background", className: "bg-background" },
      { name: "card", className: "bg-card" },
      { name: "popover", className: "bg-popover" },
      { name: "muted", className: "bg-muted" },
      { name: "accent", className: "bg-accent" },
    ],
  },
  {
    title: "Roles",
    items: [
      { name: "primary", className: "bg-primary" },
      { name: "brand", className: "bg-brand" },
      { name: "success", className: "bg-success" },
      { name: "warning", className: "bg-warning" },
      { name: "danger", className: "bg-danger" },
    ],
  },
  {
    title: "Charts · always assigned in this order",
    items: [
      { name: "chart-1 · iris", className: "bg-chart-1" },
      { name: "chart-2 · aqua", className: "bg-chart-2" },
      { name: "chart-3 · orange", className: "bg-chart-3" },
      { name: "chart-4 · blue", className: "bg-chart-4" },
      { name: "chart-5 · magenta", className: "bg-chart-5" },
    ],
  },
  {
    title: "Lines",
    items: [
      { name: "border", className: "bg-border" },
      { name: "input", className: "bg-input" },
      { name: "ring", className: "bg-ring" },
    ],
  },
];

const textTokens = [
  { name: "foreground", className: "text-foreground" },
  { name: "muted-foreground", className: "text-muted-foreground" },
  { name: "subtle-foreground", className: "text-subtle-foreground" },
];

const typeScale = [
  {
    label: "Display · 48 semibold",
    className: "text-5xl font-semibold tracking-tight",
    sample: "Write the hook.",
  },
  {
    label: "Heading 1 · 30 semibold",
    className: "text-3xl font-semibold tracking-tight",
    sample: "Overview",
  },
  {
    label: "Heading 2 · 20 semibold",
    className: "text-xl font-semibold tracking-tight",
    sample: "Top reels",
  },
  {
    label: "Body · 14",
    className: "max-w-prose text-sm leading-relaxed text-muted-foreground",
    sample:
      "Plan ideas, write scripts, and see which hooks keep people watching past the first three seconds.",
  },
  {
    label: "Caption · 12",
    className: "text-xs text-subtle-foreground",
    sample: "Updated 2 minutes ago",
  },
  {
    label: "Mono · 13",
    className: "font-mono text-[13px]",
    sample: "@yourchannel · 1,384,920 views",
  },
];

const radii = [
  { name: "rounded-sm · 6", className: "rounded-sm" },
  { name: "rounded-md · 8", className: "rounded-md" },
  { name: "rounded-lg · 12", className: "rounded-lg" },
  { name: "rounded-xl · 16", className: "rounded-xl" },
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 border-t border-border py-12"
    >
      <div className="mb-8 max-w-xl">
        <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, className }: SwatchItem) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("h-14 rounded-md border border-border", className)} />
      <code className="font-mono text-xs text-muted-foreground">{name}</code>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-md">
              <Logo />
            </Link>
            <span aria-hidden="true" className="text-subtle-foreground">
              /
            </span>
            <span className="text-sm text-muted-foreground">Design system</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <div className="py-12">
          <h1 className="text-3xl font-semibold tracking-tight">Design system</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Every color, type style and component in Hookline. Use the switch in the top right to
            check both themes.
          </p>
          <Button asChild className="mt-6">
            <Link href="/design/dashboard">
              <LayoutDashboard />
              Open the dashboard preview
            </Link>
          </Button>
          <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>

        <Section
          id="colors"
          title="Colors"
          description="Soft charcoal surfaces, one brand color (Iris), and status colors that always come with an icon or label."
        >
          <div className="grid gap-10">
            {swatchGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-3 text-sm font-medium">{group.title}</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  {group.items.map((item) => (
                    <Swatch key={item.name} {...item} />
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h3 className="mb-3 text-sm font-medium">Text</h3>
              <div className="grid gap-2">
                {textTokens.map((token) => (
                  <p key={token.name} className={cn("text-sm", token.className)}>
                    The quick hook keeps people watching ·{" "}
                    <code className="font-mono text-xs">{token.name}</code>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="type"
          title="Type"
          description="Geist for everything, Geist Mono for code and aligned numbers."
        >
          <div className="grid gap-8">
            {typeScale.map((item) => (
              <div key={item.label} className="grid gap-1.5">
                <span className="font-mono text-xs text-subtle-foreground">{item.label}</span>
                <p className={item.className}>{item.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="buttons"
          title="Buttons"
          description="Slightly rounded rectangles, never pills. Primary for the main action, brand for key moments like connecting an account."
        >
          <div className="grid gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="brand">Brand</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Delete</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button>Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" variant="secondary" aria-label="Add">
                <Plus />
              </Button>
              <Button size="icon-sm" variant="ghost" aria-label="Search">
                <Search />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                <Plus />
                New script
              </Button>
              <Button variant="brand">
                <Link2 />
                Connect account
              </Button>
              <Button loading>Saving</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </Section>

        <Section
          id="forms"
          title="Forms"
          description="Calm borders at rest, an Iris ring on focus, and a clear message when something is wrong."
        >
          <div className="grid max-w-md gap-6">
            <div className="grid gap-2">
              <Label htmlFor="design-handle">YouTube handle</Label>
              <Input id="design-handle" placeholder="@yourchannel" />
              <p className="text-xs text-subtle-foreground">Any public channel works.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="design-search" className="sr-only">
                Search reels
              </Label>
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle-foreground"
                />
                <Input id="design-search" placeholder="Search reels" className="pl-9" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="design-invalid">Handle with an error</Label>
              <Input
                id="design-invalid"
                defaultValue="not a handle"
                aria-invalid="true"
                aria-describedby="design-invalid-message"
              />
              <p id="design-invalid-message" className="text-xs text-danger">
                Handles start with @ and have no spaces.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="design-hook">Hook</Label>
              <Textarea id="design-hook" placeholder="The first line your viewer hears…" />
            </div>
          </div>
        </Section>

        <Section
          id="controls"
          title="Controls"
          description="Segmented controls for quick filters, switches for settings, tabs for different views of the same thing."
        >
          <ControlsDemo />
        </Section>

        <Section
          id="overlays"
          title="Overlays"
          description="Dialogs confirm, menus offer choices, popovers hold small forms, and tooltips name icon buttons."
        >
          <OverlayDemo />
        </Section>

        <Section
          id="toasts"
          title="Toasts"
          description="Short confirmations in the bottom right. Each type has its own icon, so color is never the only signal."
        >
          <ToastDemo />
        </Section>

        <Section
          id="command"
          title="Command menu"
          description="Jump to any page or run an action from the keyboard."
        >
          <CommandDemo />
        </Section>

        <Section
          id="badges"
          title="Badges"
          description="Small labels for status. The text always says what the color means."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Draft</Badge>
            <Badge variant="brand" dot>
              Editing
            </Badge>
            <Badge variant="success" dot>
              Published
            </Badge>
            <Badge variant="warning" dot>
              Needs review
            </Badge>
            <Badge variant="danger" dot>
              Sync failed
            </Badge>
          </div>
        </Section>

        <Section
          id="cards"
          title="Cards"
          description="The main building block for dashboards. Loading states use a soft shimmer instead of spinners."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Views</CardTitle>
                <CardDescription>Last 28 days · sample data</CardDescription>
                <CardAction>
                  <Badge variant="success">
                    <TrendingUp />
                    24.6%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">1.38M</p>
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button variant="ghost" size="sm" className="-ml-2">
                  View reels
                  <ArrowRight />
                </Button>
              </CardFooter>
            </Card>

            <Card role="status" aria-label="Loading">
              <CardHeader>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3.5 w-36" />
              </CardHeader>
              <CardContent className="grid gap-3">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3.5 w-full" />
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          id="stats"
          title="Stats"
          description="A headline number with a label and how it moved against a named period. Green or red always comes with an arrow, and some numbers are better going down."
        >
          <div className="grid gap-10">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatTile
                label="Views"
                value="1.38M"
                change={{ value: 0.246 }}
                comparison="vs prev. 28 days"
              />
              <StatTile
                label="Saves"
                value="9,412"
                change={{ value: -0.042 }}
                comparison="vs prev. 28 days"
              />
              <StatTile
                label="Skip rate"
                value="29%"
                change={{ value: -0.03, unit: "points", upIsGood: false }}
                comparison="vs prev. 28 days"
              />
              <StatTile
                label="Hook hold"
                value="71%"
                change={{ value: 0.03, unit: "points" }}
                comparison="vs prev. 28 days"
              >
                <Meter value={0.71} aria-label="Hook hold" aria-valuetext="71%" className="mt-3" />
              </StatTile>
            </div>
            <div className="grid max-w-md gap-5">
              {meterTones.map((meter) => (
                <div key={meter.tone} className="grid gap-2">
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span>{meter.label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {Math.round(meter.value * 100)}%
                    </span>
                  </div>
                  <Meter
                    value={meter.value}
                    tone={meter.tone}
                    aria-label={meter.label}
                    aria-valuetext={`${Math.round(meter.value * 100)}%`}
                  />
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="charts"
          title="Charts"
          description="2px lines, a soft 10% wash under areas, hairline gridlines and color-blind-safe colors. Hover, or focus a chart and use the arrow keys, for exact numbers. Any chart can switch to a table."
        >
          <div className="grid grid-cols-1 gap-4">
            <ChartCard
              title="Views per day"
              description="Last 28 days · sample data"
              table={{
                columns: ["Date", "Views"],
                rows: [...last28Days]
                  .reverse()
                  .map((day) => [day.fullLabel, formatNumber(day.views)]),
              }}
            >
              <AreaChart
                name="Views"
                description="Daily views for the last 28 days, sample data."
                data={last28Days.map((day) => ({
                  label: day.label,
                  tooltipLabel: day.fullLabel,
                  value: day.views,
                }))}
              />
            </ChartCard>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard
                title="Views by format"
                description="Weekly · last 12 weeks · sample data"
                table={{
                  columns: ["Week ending", ...formatSeries.map((series) => series.name)],
                  rows: [...viewsByFormat]
                    .reverse()
                    .map((week) => [
                      week.label,
                      formatNumber(week.reels),
                      formatNumber(week.carousels),
                      formatNumber(week.photos),
                    ]),
                }}
              >
                <LineChart
                  title="Views by format"
                  description="Weekly views for reels, carousels and photos over 12 weeks, sample data."
                  series={formatSeries}
                  data={viewsByFormat}
                />
              </ChartCard>
              <ChartCard
                title="Best day to post"
                description="Average views by weekday · sample data"
                table={{
                  columns: ["Day", "Average views"],
                  rows: weekdayAverages.map((day) => [day.tooltipLabel, formatNumber(day.value)]),
                }}
              >
                <BarChart
                  name="Average views"
                  description="Average daily views for each weekday over the last 12 weeks, sample data."
                  data={weekdayAverages}
                />
              </ChartCard>
            </div>
          </div>
        </Section>

        <Section
          id="details"
          title="Details"
          description="Keyboard hints, dividers and corner radii."
        >
          <div className="grid gap-8">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              Press
              <span className="inline-flex gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
              to search anywhere.
            </p>
            <Separator />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {radii.map((radius) => (
                <div key={radius.name} className="flex flex-col gap-2">
                  <div className={cn("h-16 border border-border bg-card", radius.className)} />
                  <code className="font-mono text-xs text-muted-foreground">{radius.name}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
