import { Suspense } from "react";
import type { Metadata } from "next";
import { CircleAlert, SearchX } from "lucide-react";

import { ChannelDashboard } from "@/components/youtube/channel-dashboard";
import { ChannelMessage } from "@/components/youtube/channel-message";
import { ChannelSearch } from "@/components/youtube/channel-search";
import { ChannelSkeleton } from "@/components/youtube/channel-skeleton";
import { getChannelOverview } from "@/lib/youtube/channel";
import {
  channelPath,
  describeChannelRef,
  parseChannelInput,
  safeDecode,
} from "@/lib/youtube/handle";

/**
 * Next needs at least one path to build ahead of time. "-" isn't a real handle, so building the
 * site never calls YouTube. Real channels are built on their first visit, then served from the
 * cache, and refreshed about every hour (see getChannelOverview).
 */
export function generateStaticParams() {
  return [{ handle: "-" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/youtube/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const ref = parseChannelInput(safeDecode(handle));
  // Lookup pages change all the time, so search engines shouldn't list them.
  const robots = { index: false, follow: true };
  if (!ref) return { title: "Channel lookup", robots };

  // If YouTube fails here, the page itself shows the error. The title just stays plain.
  const overview = await getChannelOverview(ref).catch(() => null);
  const channel = overview?.channel;

  return {
    title: channel
      ? channel.handle
        ? `${channel.title} (${channel.handle})`
        : channel.title
      : describeChannelRef(ref),
    description: channel
      ? `Subscribers, views and the latest uploads from ${channel.title}, with data from YouTube.`
      : undefined,
    alternates: { canonical: channelPath(ref) },
    robots,
  };
}

export default function ChannelPage({ params }: PageProps<"/youtube/[handle]">) {
  return (
    <Suspense fallback={<ChannelSkeleton />}>
      <ChannelContent params={params} />
    </Suspense>
  );
}

async function ChannelContent({ params }: Pick<PageProps<"/youtube/[handle]">, "params">) {
  const { handle } = await params;
  const input = safeDecode(handle);
  const ref = parseChannelInput(input);

  if (!ref) {
    return (
      <ChannelMessage
        icon={CircleAlert}
        title="That doesn't look like a channel"
        description="Enter a handle like @mkbhd, or paste a link to the channel from YouTube."
      >
        <ChannelSearch defaultValue={input === "-" ? "" : input} />
      </ChannelMessage>
    );
  }

  const overview = await getChannelOverview(ref);

  if (!overview) {
    return (
      <ChannelMessage
        icon={SearchX}
        title={`We couldn't find ${describeChannelRef(ref)}`}
        description="Check the spelling, or paste the link from the channel's page on YouTube."
      >
        <ChannelSearch defaultValue={describeChannelRef(ref)} />
      </ChannelMessage>
    );
  }

  return <ChannelDashboard overview={overview} />;
}
