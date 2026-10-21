import { BarChart } from "@/components/charts/bar-chart";
import { ChartCard } from "@/components/charts/chart-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import { ChannelHeader } from "@/components/youtube/channel-header";
import { RelativeTime } from "@/components/youtube/relative-time";
import { UploadsTable } from "@/components/youtube/uploads-table";
import { VideoThumbnail } from "@/components/youtube/video-thumbnail";
import { youtubeVideoUrl } from "@/components/youtube/youtube-link";
import { formatCompact, formatNumber, formatStat } from "@/lib/format";
import type { ChannelOverview, ChannelVideo } from "@/lib/youtube/channel";
import { formatFullDate, formatMonthYear, formatShortDate } from "@/lib/youtube/format";

const CHART_VIDEOS = 30;
const TOP_VIDEOS = 5;
const DAY = 86_400_000;

/**
 * A channel's public numbers, straight from YouTube. YouTube's API rules don't allow numbers we
 * work out ourselves (averages, rates, scores), so everything here is shown as YouTube gives it.
 */
export function ChannelDashboard({ overview }: { overview: ChannelOverview }) {
  const { channel, uploads, popular, fetchedAt } = overview;

  return (
    <div className="grid grid-cols-1 gap-6">
      <ChannelHeader channel={channel} />

      <section
        aria-label="Channel numbers"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        <StatTile
          label="Subscribers"
          value={channel.subscriberCount === null ? "Hidden" : formatStat(channel.subscriberCount)}
        >
          <TileNote>
            {channel.subscriberCount === null ? "The creator hides this" : "Rounded by YouTube"}
          </TileNote>
        </StatTile>
        <StatTile
          label="Total views"
          value={channel.viewCount === null ? "—" : formatStat(channel.viewCount)}
        >
          <TileNote>
            {channel.viewCount !== null && channel.viewCount >= 10_000
              ? `Exactly ${formatNumber(channel.viewCount)}`
              : "Across all public videos"}
          </TileNote>
        </StatTile>
        <StatTile
          label="Videos"
          value={channel.videoCount === null ? "—" : formatStat(channel.videoCount)}
        >
          <TileNote>Public uploads</TileNote>
        </StatTile>
      </section>

      {uploads.length > 0 ? (
        <>
          <RecentUploads uploads={uploads} popular={popular} />
          <UploadsTable uploads={uploads} popular={popular} totalCount={channel.videoCount} />
        </>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-sm font-medium">No public videos yet</p>
            <p className="mt-1 text-[13px] text-subtle-foreground">
              When {channel.title} uploads, the videos will show up here.
            </p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs leading-relaxed text-subtle-foreground">
        Public data from the YouTube Data API, refreshed about every hour. Last updated{" "}
        <RelativeTime iso={fetchedAt} />. Hookline isn&apos;t affiliated with YouTube.
      </p>
    </div>
  );
}

function TileNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-xs text-subtle-foreground">{children}</p>;
}

/** Views on each recent upload, plus the channel's most viewed videos. */
function RecentUploads({
  uploads,
  popular,
}: {
  uploads: ChannelVideo[];
  popular: ChannelVideo[] | null;
}) {
  // Premieres and streams that haven't started have no views yet, so they'd only add empty bars.
  const recent = uploads
    .filter((video) => video.liveStatus !== "upcoming" && video.viewCount !== null)
    .slice(0, CHART_VIDEOS)
    .reverse();

  // YouTube's all-time list when we have it, otherwise the most viewed of the newest uploads.
  const top = (
    popular ??
    uploads
      .filter((video) => video.liveStatus !== "upcoming" && video.viewCount !== null)
      .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
  ).slice(0, TOP_VIDEOS);

  // A handful of videos reads better as the table alone.
  if (recent.length < 3) return null;

  const first = recent[0];
  const last = recent[recent.length - 1];
  // Uploads more than a year apart get month-and-year labels, so the dates aren't ambiguous.
  const spansYears =
    first && last && Date.parse(last.publishedAt) - Date.parse(first.publishedAt) > 330 * DAY;
  const label = spansYears ? formatMonthYear : formatShortDate;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <ChartCard
        title="Views on recent uploads"
        description={`Latest ${recent.length} videos, oldest to newest`}
        table={{
          columns: ["Video", "Published", "Views"],
          rows: [...recent]
            .reverse()
            .map((video) => [
              video.title,
              formatFullDate(video.publishedAt),
              formatNumber(video.viewCount ?? 0),
            ]),
        }}
      >
        <BarChart
          name="Views"
          height={300}
          description={`Views on each of the latest ${recent.length} videos, oldest first.`}
          data={recent.map((video) => ({
            label: label(video.publishedAt),
            tooltipLabel: `${formatFullDate(video.publishedAt)} · ${video.title}`,
            value: video.viewCount ?? 0,
          }))}
        />
      </ChartCard>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Most viewed</CardTitle>
          <CardDescription className="text-xs text-subtle-foreground">
            {popular ? "All time, not counting Shorts" : `Of the newest ${uploads.length} uploads`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="-my-2.5">
            {top.map((video) => (
              <li key={video.id} className="border-t border-border first:border-t-0">
                <a
                  href={youtubeVideoUrl(video.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-md py-2.5"
                >
                  <VideoThumbnail src={video.thumbnailUrl} className="w-20" />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[13px] leading-snug font-medium group-hover:underline">
                      {video.title}
                    </span>
                    <span className="mt-1 block text-xs text-subtle-foreground tabular-nums">
                      <span title={formatNumber(video.viewCount ?? 0)}>
                        {formatCompact(video.viewCount ?? 0)} views
                      </span>
                      {" · "}
                      {formatFullDate(video.publishedAt)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
