/**
 * Made-up numbers for the design system pages. Nothing here is real.
 * The numbers come from a seeded generator, so the server and the browser
 * always produce exactly the same values.
 */

const DAY_MS = 86_400_000;
/** The newest day in the sample: Sunday, Oct 18, 2026 (UTC). */
const LAST_DAY = Date.UTC(2026, 9, 18);
const TOTAL_DAYS = 180;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_NAMES = [
  "Sundays",
  "Mondays",
  "Tuesdays",
  "Wednesdays",
  "Thursdays",
  "Fridays",
  "Saturdays",
];

/** How much busier each weekday is than average, Sunday first. */
const WEEKDAY_LIFT = [1.12, 0.92, 0.95, 1, 1.02, 1.06, 1.1];

/** Reels that took off: [days ago, extra views that day]. Each fades over the next few days. */
const VIRAL_DAYS = [
  [9, 55_000],
  [52, 140_000],
] as const;

export type DailyStat = {
  /** Short label for chart axes: "Oct 18". */
  label: string;
  /** Long label for tooltips and tables: "Sun, Oct 18". */
  fullLabel: string;
  /** 0 is Sunday. */
  weekday: number;
  views: number;
  reach: number;
  saves: number;
  /** Share of viewers still watching after 3 seconds, from 0 to 1. */
  hookHold: number;
};

/** A tiny seeded random number generator (mulberry32): the same seed gives the same numbers. */
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** Eases from 0 to 1 as `t` goes from 0 to 1. */
function smoothstep(t: number) {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
}

function buildDailyStats(): DailyStat[] {
  const random = seededRandom(20_261_018);
  const days: DailyStat[] = [];

  for (let index = 0; index < TOTAL_DAYS; index++) {
    const daysAgo = TOTAL_DAYS - 1 - index;
    const date = new Date(LAST_DAY - daysAgo * DAY_MS);
    const weekday = date.getUTCDay();
    const month = MONTHS[date.getUTCMonth()];
    const label = `${month} ${date.getUTCDate()}`;

    // Slow growth that picks up over the last six weeks, a weekly rhythm, noise, and viral spikes.
    const steady = 15_000 * 2.5 ** (index / (TOTAL_DAYS - 1));
    const pickUp = 30_000 * smoothstep((index - 135) / (TOTAL_DAYS - 1 - 135));
    const noise = 1 + (random() - 0.5) * 0.14;
    let viral = 0;
    for (const [ago, extra] of VIRAL_DAYS) {
      const since = ago - daysAgo;
      if (since >= 0) viral += extra * 0.55 ** since;
    }
    const views = Math.round((steady + pickUp) * (WEEKDAY_LIFT[weekday] ?? 1) * noise + viral);

    days.push({
      label,
      fullLabel: `${WEEKDAYS[weekday]}, ${label}`,
      weekday,
      views,
      reach: Math.round(views * (0.35 + random() * 0.04)),
      saves: Math.round(views * (0.0062 + random() * 0.0012)),
      hookHold: Math.min(0.92, 0.62 + 0.1 * (index / (TOTAL_DAYS - 1)) + (random() - 0.5) * 0.06),
    });
  }

  return days;
}

export const dailyStats = buildDailyStats();

export type Reel = {
  id: string;
  title: string;
  daysAgo: number;
  views: number;
  hookHold: number;
};

// [id, title, days ago, views, hook hold]
const reels: readonly Reel[] = (
  [
    ["r1", "Rating my old hooks, brutally", 2, 98_400, 0.64],
    ["r2", "The 3-second rule nobody explains", 5, 162_300, 0.71],
    ["r3", "I posted at 6 AM for 30 days", 9, 214_800, 0.78],
    ["r4", "3 edits that doubled my watch time", 16, 131_200, 0.69],
    ["r5", "My whole camera setup, explained", 31, 88_900, 0.58],
    ["r6", "I copied viral hooks for a week", 52, 305_600, 0.81],
    ["r7", "What 1,000 reels taught me about hooks", 74, 176_400, 0.74],
    ["r8", "A day in my life as a full-time creator", 85, 64_200, 0.55],
  ] as const
).map(([id, title, daysAgo, views, hookHold]) => ({ id, title, daysAgo, views, hookHold }));

export const RANGES = [7, 28, 90] as const;
export type RangeDays = (typeof RANGES)[number];

export type MetricSummary = {
  value: number;
  /** Against the previous period: relative for counts (0.25 = +25%), in points for shares. */
  change: number;
};

export type RangeSummary = {
  days: DailyStat[];
  views: MetricSummary;
  reach: MetricSummary;
  saves: MetricSummary;
  hookHold: MetricSummary;
  topReels: Reel[];
};

function total(days: readonly DailyStat[], key: "views" | "reach" | "saves") {
  return days.reduce((sum, day) => sum + day[key], 0);
}

/** Hook hold across a period, weighted by views so busy days count for more. */
function averageHookHold(days: readonly DailyStat[]) {
  const views = total(days, "views");
  return views > 0 ? days.reduce((sum, day) => sum + day.hookHold * day.views, 0) / views : 0;
}

function growth(current: number, previous: number) {
  return previous > 0 ? current / previous - 1 : 0;
}

function summarize(range: RangeDays): RangeSummary {
  const current = dailyStats.slice(-range);
  const previous = dailyStats.slice(-2 * range, -range);

  const counts = (key: "views" | "reach" | "saves"): MetricSummary => {
    const value = total(current, key);
    return { value, change: growth(value, total(previous, key)) };
  };
  const hookHold = averageHookHold(current);

  return {
    days: current,
    views: counts("views"),
    reach: counts("reach"),
    saves: counts("saves"),
    hookHold: { value: hookHold, change: hookHold - averageHookHold(previous) },
    topReels: reels
      .filter((reel) => reel.daysAgo < range)
      .sort((a, b) => b.views - a.views)
      .slice(0, 3),
  };
}

export const rangeSummaries: Record<RangeDays, RangeSummary> = {
  7: summarize(7),
  28: summarize(28),
  90: summarize(90),
};

/** Average views per weekday over the last 12 weeks, Monday first. */
export const weekdayAverages = [1, 2, 3, 4, 5, 6, 0].map((weekday) => {
  const days = dailyStats.slice(-84).filter((day) => day.weekday === weekday);
  return {
    label: WEEKDAYS[weekday] ?? "",
    tooltipLabel: WEEKDAY_NAMES[weekday] ?? "",
    value: Math.round(total(days, "views") / Math.max(days.length, 1)),
  };
});

/** Weekly views split by post format over the last 12 weeks. */
export const viewsByFormat = [
  [84_200, 31_400, 12_100],
  [90_300, 30_200, 12_800],
  [97_100, 33_500, 11_900],
  [95_400, 35_100, 13_600],
  [104_800, 34_300, 13_200],
  [112_300, 37_000, 12_900],
  [121_600, 36_200, 14_700],
  [118_900, 39_400, 14_100],
  [133_200, 41_100, 13_800],
  [146_700, 40_300, 15_600],
  [158_100, 43_200, 15_200],
  [171_400, 45_600, 16_300],
].map(([reels, carousels, photos], index) => {
  const weekEnd = dailyStats[dailyStats.length - 1 - (11 - index) * 7];
  return {
    label: weekEnd?.label ?? "",
    tooltipLabel: `Week ending ${weekEnd?.label ?? ""}`,
    reels: reels ?? 0,
    carousels: carousels ?? 0,
    photos: photos ?? 0,
  };
});

export const upNext = [
  { id: "u1", title: "Why your hook dies in 3 seconds", stage: "Scripting", due: "Tue" },
  { id: "u2", title: "6 AM posting experiment, week 4", stage: "Editing", due: "Thu" },
  { id: "u3", title: "Reacting to my first 100 reels", stage: "Scheduled", due: "Sat, 6:00 PM" },
] as const;
