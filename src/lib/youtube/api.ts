import "server-only";

import { z } from "zod";

const API_BASE_URL = "https://www.googleapis.com/youtube/v3";

/** A failed call to the YouTube Data API, with the reason YouTube gave (like "quotaExceeded"). */
export class YouTubeApiError extends Error {
  readonly status: number;
  readonly reason: string | undefined;

  constructor(message: string, status: number, reason?: string) {
    super(message);
    this.name = "YouTubeApiError";
    this.status = status;
    this.reason = reason;
  }
}

// YouTube sends counts as strings ("1234"); these turn them into numbers.
const count = z.coerce.number().int().nonnegative();

const thumbnail = z.object({ url: z.string() });
const thumbnails = z.object({
  default: thumbnail.optional(),
  medium: thumbnail.optional(),
  high: thumbnail.optional(),
});

export const channelListSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        snippet: z.object({
          title: z.string(),
          description: z.string().default(""),
          customUrl: z.string().optional(),
          publishedAt: z.string(),
          thumbnails: thumbnails.optional(),
          country: z.string().optional(),
        }),
        contentDetails: z
          .object({ relatedPlaylists: z.object({ uploads: z.string().optional() }).optional() })
          .optional(),
        statistics: z
          .object({
            viewCount: count.optional(),
            subscriberCount: count.optional(),
            hiddenSubscriberCount: z.boolean().optional(),
            videoCount: count.optional(),
          })
          .optional(),
      }),
    )
    .optional(),
});

export const playlistItemListSchema = z.object({
  items: z
    .array(
      z.object({
        contentDetails: z.object({ videoId: z.string() }).optional(),
      }),
    )
    .optional(),
});

export const videoListSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        snippet: z.object({
          title: z.string(),
          publishedAt: z.string(),
          thumbnails: thumbnails.optional(),
          liveBroadcastContent: z.string().optional(),
        }),
        contentDetails: z.object({ duration: z.string().optional() }).optional(),
        statistics: z
          .object({
            viewCount: count.optional(),
            likeCount: count.optional(),
            commentCount: count.optional(),
          })
          .optional(),
      }),
    )
    .optional(),
});

const errorSchema = z.object({
  error: z.object({
    message: z.string(),
    errors: z.array(z.object({ reason: z.string().optional() })).optional(),
  }),
});

type Endpoint = "channels" | "playlistItems" | "videos";

/** Calls one YouTube Data API endpoint and checks the response has the shape we expect. */
export async function youtubeGet<Schema extends z.ZodType>(
  endpoint: Endpoint,
  params: Record<string, string>,
  schema: Schema,
): Promise<z.infer<Schema>> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is missing. Add it to .env.local and to your Vercel project.");
  }

  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = errorSchema.safeParse(body);
    throw new YouTubeApiError(
      parsed.success ? parsed.data.error.message : `YouTube answered with ${response.status}.`,
      response.status,
      parsed.success ? parsed.data.error.errors?.[0]?.reason : undefined,
    );
  }

  return schema.parse(body);
}
