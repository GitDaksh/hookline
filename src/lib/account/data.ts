import "server-only";

import { createClient } from "@/lib/supabase/server";
import { parseChannelInput, type ChannelRef } from "@/lib/youtube/handle";

/**
 * The YouTube channel this person saved, or null. The database's own rules only ever return
 * their row, so asking for someone else's gets nothing.
 */
export async function getSavedChannel(userId: string): Promise<ChannelRef | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("youtube_channel")
    .eq("id", userId)
    .maybeSingle<{ youtube_channel: string | null }>();

  if (error) throw new Error(`Couldn't load the saved channel: ${error.message}`);
  return data?.youtube_channel ? parseChannelInput(data.youtube_channel) : null;
}
