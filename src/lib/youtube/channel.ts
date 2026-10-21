import "server-only";

import { cacheLife } from "next/cache";

import {
  YouTubeApiError,
  channelListSchema,
  playlistItemListSchema,
  videoListSchema,
  youtubeGet,
} from "@/lib/youtube/api";
import { parseDuration } from "@/lib/youtube/format";
import type { ChannelRef } from "@/lib/youtube/handle";

export type ChannelVideo = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  /** "live" or "upcoming" for streams and premieres, otherwise "none". */
  liveStatus: "none" | "live" | "upcoming";
  viewCount: number | null;
  /** null when the creator hides likes. */
  likeCount: number | null;
  /** null when comments are turned off. */
  commentCount: number | null;
};

export type ChannelOverview = {
  /** When Hookline fetched this from YouTube (ISO date). */
  fetchedAt: string;
  channel: {
    id: string;
    title: string;
    /** Like "@mkbhd". Some older channels don't have one. */
    handle: string | null;
    description: string;
    publishedAt: string;
    country: string | null;
    avatarUrl: string | null;
    /** null when the channel hides its subscriber count. YouTube rounds this number. */
    subscriberCount: number | null;
    viewCount: number | null;
    videoCount: number | null;
  };
  /** Up to 50 of the newest public uploads (videos, Shorts and streams), newest first. */
  uploads: ChannelVideo[];
  /**
   * The channel's most viewed videos of all time (up to 50, without Shorts or streams), most
   * viewed first: the list YouTube shows under Videos → Popular. null when YouTube doesn't give it.
   */
  popular: ChannelVideo[] | null;
};

/**
 * Everything the channel page shows, in 5 YouTube API calls (5 units of the 10,000 daily quota).
 * Cached for an hour so repeat visits don't spend quota. Returns null if there's no such channel.
 */
export async function getChannelOverview(ref: ChannelRef): Promise<ChannelOverview | null> {
  "use cache";
  cacheLife("hours");

  const filter: Record<string, string> =
    ref.kind === "handle" ? { forHandle: `@${ref.handle}` } : { id: ref.id };

  let channels;
  try {
    channels = await youtubeGet(
      "channels",
      { part: "snippet,contentDetails,statistics", maxResults: "1", ...filter },
      channelListSchema,
    );
  } catch (error) {
    if (error instanceof YouTubeApiError && error.status === 404) return null;
    throw error;
  }

  const channel = channels.items?.[0];
  if (!channel) return null;

  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
  const { snippet, statistics } = channel;

  const [uploads, popular]: [ChannelVideo[], ChannelVideo[] | null] = uploadsPlaylistId
    ? await Promise.all([getPlaylistVideos(uploadsPlaylistId), getPopularVideos(channel.id)])
    : [[], null];

  return {
    fetchedAt: new Date().toISOString(),
    channel: {
      id: channel.id,
      title: snippet.title,
      handle: snippet.customUrl ?? null,
      description: snippet.description,
      publishedAt: snippet.publishedAt,
      country: snippet.country ?? null,
      avatarUrl:
        snippet.thumbnails?.medium?.url ??
        snippet.thumbnails?.high?.url ??
        snippet.thumbnails?.default?.url ??
        null,
      subscriberCount: statistics?.hiddenSubscriberCount
        ? null
        : (statistics?.subscriberCount ?? null),
      viewCount: statistics?.viewCount ?? null,
      videoCount: statistics?.videoCount ?? null,
    },
    uploads: uploads.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
    popular,
  };
}

/**
 * YouTube keeps a "popular videos" playlist for every channel (what its Videos → Popular tab
 * shows). Its ID is the channel ID with "UC" swapped for "UULP". YouTube doesn't document it, so
 * if it's missing or fails, this returns null and the page sorts the newest uploads instead.
 */
async function getPopularVideos(channelId: string): Promise<ChannelVideo[] | null> {
  if (!channelId.startsWith("UC")) return null;
  try {
    const videos = await getPlaylistVideos(`UULP${channelId.slice(2)}`);
    if (videos.length === 0) return null;
    return videos.sort((a, b) => (b.viewCount ?? -1) - (a.viewCount ?? -1));
  } catch {
    return null;
  }
}

/** Up to 50 videos from a playlist, with their stats. A missing playlist gives an empty list. */
async function getPlaylistVideos(playlistId: string): Promise<ChannelVideo[]> {
  let playlist;
  try {
    playlist = await youtubeGet(
      "playlistItems",
      { part: "contentDetails", playlistId, maxResults: "50" },
      playlistItemListSchema,
    );
  } catch (error) {
    // Channels that never uploaded don't have an uploads playlist yet.
    if (error instanceof YouTubeApiError && error.status === 404) return [];
    throw error;
  }

  const ids = (playlist.items ?? []).flatMap((item) =>
    item.contentDetails ? [item.contentDetails.videoId] : [],
  );
  if (ids.length === 0) return [];

  const videos = await youtubeGet(
    "videos",
    { part: "snippet,contentDetails,statistics", id: ids.join(","), maxResults: "50" },
    videoListSchema,
  );

  return (videos.items ?? []).map((video): ChannelVideo => {
    const live = video.snippet.liveBroadcastContent;
    return {
      id: video.id,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
      thumbnailUrl:
        video.snippet.thumbnails?.medium?.url ?? video.snippet.thumbnails?.default?.url ?? null,
      durationSeconds: parseDuration(video.contentDetails?.duration),
      liveStatus: live === "live" || live === "upcoming" ? live : "none",
      viewCount: video.statistics?.viewCount ?? null,
      likeCount: video.statistics?.likeCount ?? null,
      commentCount: video.statistics?.commentCount ?? null,
    };
  });
}
