"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { VideoThumbnail } from "@/components/youtube/video-thumbnail";
import { youtubeVideoUrl } from "@/components/youtube/youtube-link";
import { formatCompact, formatNumber } from "@/lib/format";
import type { ChannelVideo } from "@/lib/youtube/channel";
import { formatDuration, formatFullDate } from "@/lib/youtube/format";
import { cn } from "@/lib/utils";

type Tab = "latest" | "popular";

const FIRST_ROWS = 10;

type UploadsTableProps = {
  /** The newest uploads, newest first. */
  uploads: ChannelVideo[];
  /** The all-time most viewed videos from YouTube, or null if YouTube didn't give them. */
  popular: ChannelVideo[] | null;
  /** How many public videos the channel has in all. */
  totalCount: number | null;
};

/** The channel's videos, like YouTube's own tabs: the latest uploads, or the most popular. */
export function UploadsTable({ uploads, popular, totalCount }: UploadsTableProps) {
  const [tab, setTab] = useState<Tab>("latest");
  const [showAll, setShowAll] = useState(false);

  // Without YouTube's popular list, "Popular" sorts the newest uploads by views instead.
  const popularVideos =
    popular ?? [...uploads].sort((a, b) => (b.viewCount ?? -1) - (a.viewCount ?? -1));
  const videos = tab === "latest" ? uploads : popularVideos;
  const visible = showAll ? videos : videos.slice(0, FIRST_ROWS);

  const description =
    tab === "popular"
      ? popular
        ? "Most viewed of all time, not counting Shorts or streams"
        : `The newest ${uploads.length} uploads, most viewed first`
      : totalCount !== null && totalCount > uploads.length
        ? `The newest ${uploads.length} of ${formatNumber(totalCount)} videos`
        : uploads.length === 1
          ? "1 video"
          : `${uploads.length} videos`;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Videos</CardTitle>
        <CardDescription className="text-xs text-subtle-foreground">{description}</CardDescription>
        <CardAction>
          <SegmentedControl
            aria-label="Show videos"
            value={tab}
            onValueChange={(value) => {
              if (value === "latest" || value === "popular") {
                setTab(value);
                setShowAll(false);
              }
            }}
            className="h-8"
          >
            <SegmentedControlItem value="latest" className="px-2.5 text-xs">
              Latest
            </SegmentedControlItem>
            <SegmentedControlItem value="popular" className="px-2.5 text-xs">
              Popular
            </SegmentedControlItem>
          </SegmentedControl>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-3">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-xs text-subtle-foreground">
              <th scope="col" className="h-9 pr-3 text-left font-medium">
                Video
              </th>
              <th scope="col" className="hidden h-9 px-3 text-right font-medium md:table-cell">
                Length
              </th>
              <th scope="col" className="h-9 pl-3 text-right font-medium sm:px-3">
                Views
              </th>
              <th scope="col" className="hidden h-9 px-3 text-right font-medium sm:table-cell">
                Likes
              </th>
              <th scope="col" className="hidden h-9 pl-3 text-right font-medium sm:table-cell">
                Comments
              </th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {visible.map((video) => (
              <tr key={video.id} className="border-t border-border">
                <td className="py-2.5 pr-3">
                  <a
                    href={youtubeVideoUrl(video.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-md"
                  >
                    <VideoThumbnail src={video.thumbnailUrl} className="w-20 sm:w-24" />
                    <span className="min-w-0">
                      <span className="line-clamp-2 leading-snug font-medium group-hover:underline">
                        {video.title}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle-foreground">
                        {formatFullDate(video.publishedAt)}
                        {video.liveStatus === "live" && (
                          <Badge variant="danger" dot className="h-5 px-1.5">
                            Live
                          </Badge>
                        )}
                        {video.liveStatus === "upcoming" && (
                          <Badge className="h-5 px-1.5">Upcoming</Badge>
                        )}
                      </span>
                    </span>
                  </a>
                </td>
                <td className="hidden px-3 text-right text-muted-foreground md:table-cell">
                  {video.durationSeconds ? formatDuration(video.durationSeconds) : "—"}
                </td>
                <StatCell
                  value={video.viewCount}
                  missing="Not available"
                  className="pr-0 pl-3 sm:px-3"
                />
                <StatCell
                  value={video.likeCount}
                  missing="Hidden by the creator"
                  className="hidden sm:table-cell"
                />
                <StatCell
                  value={video.commentCount}
                  missing="Comments are off"
                  className="hidden pr-0 sm:table-cell"
                />
              </tr>
            ))}
          </tbody>
        </table>

        {videos.length > FIRST_ROWS && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAll((current) => !current)}
            className="justify-self-start"
          >
            {showAll ? "Show fewer" : `Show all ${videos.length}`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/** A number cell: short form ("1.2M") with the exact number on hover, or a dash if missing. */
function StatCell({
  value,
  missing,
  className,
}: {
  value: number | null;
  missing: string;
  className?: string;
}) {
  return (
    <td
      title={value === null ? missing : formatNumber(value)}
      className={cn("px-3 text-right", value === null && "text-subtle-foreground", className)}
    >
      {value === null ? (
        <>
          <span aria-hidden="true">—</span>
          <span className="sr-only">{missing}</span>
        </>
      ) : (
        formatCompact(value)
      )}
    </td>
  );
}