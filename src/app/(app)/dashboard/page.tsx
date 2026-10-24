import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Check, SearchX, TriangleAlert, type LucideIcon } from "lucide-react";

import { ChannelDialog } from "@/components/account/channel-controls";
import { PageHeader } from "@/components/app-shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelDashboard } from "@/components/youtube/channel-dashboard";
import { ChannelSearch } from "@/components/youtube/channel-search";
import { ChannelSkeleton } from "@/components/youtube/channel-skeleton";
import { getSavedChannel } from "@/lib/account/data";
import { requireUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { getChannelOverview } from "@/lib/youtube/channel";
import { describeChannelRef, type ChannelRef } from "@/lib/youtube/handle";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const EXAMPLES = ["mkbhd", "veritasium", "kurzgesagt"];

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireUser("/dashboard");
  const channel = await getSavedChannel(user.id);
  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <div className="grid grid-cols-1 gap-8">
      <PageHeader
        title={`Welcome, ${firstName}`}
        description={
          channel
            ? "Here's how your channel is doing, and what's coming next."
            : "Your home in Hookline. Here's what's ready, and what's coming next."
        }
      />

      {channel && (
        <section aria-label="Your YouTube channel" className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium tracking-wide text-subtle-foreground uppercase">
              Your channel
            </p>
            <ChannelDialog current={describeChannelRef(channel)}>
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </ChannelDialog>
          </div>
          {/* YouTube can take a moment, so the rest of the page doesn't wait for it. */}
          <Suspense fallback={<ChannelSkeleton />}>
            <SavedChannel channel={channel} />
          </Suspense>
        </section>
      )}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <GetStarted channel={channel} />
        <LookupCard />
      </div>
    </div>
  );
}

async function SavedChannel({ channel }: { channel: ChannelRef }) {
  const overview = await getChannelOverview(channel).catch((error: unknown) => {
    console.error("Loading the saved channel failed:", error);
    return "failed" as const;
  });

  if (overview === "failed") {
    return (
      <ChannelNotice
        icon={TriangleAlert}
        title="Couldn't load your channel right now"
        description="YouTube didn't answer, or Hookline has used up its YouTube requests for today. Try again in a little while."
      />
    );
  }

  if (!overview) {
    return (
      <ChannelNotice
        icon={SearchX}
        title={`We couldn't find ${describeChannelRef(channel)}`}
        description="If you changed your handle on YouTube, update it here."
      >
        <ChannelDialog current={describeChannelRef(channel)}>
          <Button variant="secondary">Change channel</Button>
        </ChannelDialog>
      </ChannelNotice>
    );
  }

  return <ChannelDashboard overview={overview} headingLevel={2} />;
}

function ChannelNotice({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border">
          <Icon aria-hidden="true" className="size-4.5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium wrap-break-word">{title}</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function GetStarted({ channel }: { channel: ChannelRef | null }) {
  const steps = [
    {
      title: "Create your account",
      description: "You're signed in with Google.",
      done: true,
    },
    {
      title: "Add your YouTube channel",
      description: channel
        ? `Showing ${describeChannelRef(channel)} on your dashboard.`
        : "Your subscribers, views and latest uploads, right here.",
      done: channel !== null,
      action: channel ? null : (
        <ChannelDialog current={null}>
          <Button size="sm">Add channel</Button>
        </ChannelDialog>
      ),
    },
    {
      title: "Connect Instagram",
      description: "Reach, saves and shares for your posts and reels.",
    },
    {
      title: "Write your first script",
      description: "Plan the hook, the beats and the shots.",
    },
  ];
  const done = steps.filter((step) => step.done).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get started</CardTitle>
        <CardDescription>
          {done} of {steps.length} done
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Meter value={done} max={steps.length} aria-label="Get started progress" />
        <ol className="divide-y divide-border">
          {steps.map((step, index) => (
            <li key={step.title} className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-px flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                  step.done
                    ? "bg-success/15 text-success light:bg-success/10"
                    : "border border-border text-subtle-foreground",
                )}
              >
                {step.done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {step.action ?? (
                <Badge variant={step.done ? "success" : "neutral"}>
                  {step.done ? "Done" : "Soon"}
                </Badge>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function LookupCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Look up a channel</CardTitle>
        <CardDescription>See the numbers for any public YouTube channel.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChannelSearch />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-subtle-foreground">Try</span>
          {EXAMPLES.map((handle) => (
            <Link
              key={handle}
              href={`/youtube/${handle}`}
              className="rounded-full border border-border px-3 py-1 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:border-input hover:text-foreground"
            >
              @{handle}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div role="status" className="grid grid-cols-1 gap-8">
      <span className="sr-only">Loading your dashboard…</span>
      <div className="grid gap-2.5">
        <Skeleton className="h-8 w-full max-w-56" />
        <Skeleton className="h-4 w-full max-w-80" />
      </div>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="grid gap-5">
            <Skeleton className="h-1 w-full" />
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex items-start gap-3.5">
                <Skeleton className="size-6 shrink-0 rounded-full" />
                <div className="grid flex-1 gap-2">
                  <Skeleton className="h-4 w-full max-w-48" />
                  <Skeleton className="h-3.5 w-full max-w-72" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full max-w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-11 w-full" />
            <Skeleton className="mt-4 h-7 w-full max-w-64" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
