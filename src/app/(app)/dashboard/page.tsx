import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Check } from "lucide-react";

import { PageHeader } from "@/components/app-shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelSearch } from "@/components/youtube/channel-search";
import { requireUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

type Step = { title: string; description: string; done?: boolean };

const EXAMPLES = ["mkbhd", "veritasium", "kurzgesagt"];

const STEPS: Step[] = [
  {
    title: "Create your account",
    description: "You're signed in with Google.",
    done: true,
  },
  {
    title: "Add your YouTube channel",
    description: "Your subscribers, views and latest uploads, right here.",
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireUser("/dashboard");
  const firstName = user.name.split(" ")[0] || user.name;
  const done = STEPS.filter((step) => step.done).length;

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title={`Welcome, ${firstName}`}
        description="Your home in Hookline. Here's what's ready, and what's coming next."
      />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              {done} of {STEPS.length} done
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Meter value={done} max={STEPS.length} aria-label="Get started progress" />
            <ol className="divide-y divide-border">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0"
                >
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
                  <Badge variant={step.done ? "success" : "neutral"}>
                    {step.done ? "Done" : "Soon"}
                  </Badge>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div role="status" className="grid grid-cols-1 gap-6">
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
            {STEPS.map((step) => (
              <div key={step.title} className="flex items-start gap-3.5">
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
