import { ExpandableText } from "@/components/youtube/expandable-text";
import { ChannelAvatar } from "@/components/youtube/video-thumbnail";
import { YouTubeLink, youtubeChannelUrl } from "@/components/youtube/youtube-link";
import type { ChannelOverview } from "@/lib/youtube/channel";
import { countryName, formatMonthYear } from "@/lib/youtube/format";

type ChannelHeaderProps = {
  channel: ChannelOverview["channel"];
  /** 1 when the channel is the page itself, 2 when it's a section of a bigger page. */
  headingLevel?: 1 | 2;
};

/** The channel's picture, name, handle and description, with a link to it on YouTube. */
export function ChannelHeader({ channel, headingLevel = 1 }: ChannelHeaderProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const details = [
    channel.handle,
    `Joined ${formatMonthYear(channel.publishedAt)}`,
    channel.country ? countryName(channel.country) : null,
  ].filter((detail) => detail !== null);

  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:gap-x-5">
      <ChannelAvatar
        src={channel.avatarUrl}
        name={channel.title}
        className="size-14 sm:row-span-2 sm:size-20"
      />

      <div className="min-w-0 sm:self-center">
        <Heading className="text-2xl leading-tight font-semibold tracking-tight wrap-break-word">
          {channel.title}
        </Heading>
        <p className="mt-1 text-[13px] text-subtle-foreground">{details.join(" · ")}</p>
      </div>

      {channel.description && (
        <ExpandableText
          text={channel.description}
          className="col-span-2 max-w-2xl sm:col-span-1 sm:col-start-2"
        />
      )}

      <YouTubeLink
        href={youtubeChannelUrl(channel)}
        className="col-span-2 justify-self-start sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:self-center"
      />
    </header>
  );
}
