"use server";

import { refresh } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getChannelOverview } from "@/lib/youtube/channel";
import { describeChannelRef, parseChannelInput } from "@/lib/youtube/handle";

// These run on the server when a button is pressed. Each one checks who's signed in first,
// because anyone could call them, signed in or not.

/** What a button gets back: it worked, or a message to show. */
export type ActionResult = { ok: true } | { ok: false; error: string };

const SIGNED_OUT = "You've been signed out. Sign in again, then try once more.";
const NOT_SET_UP = "Accounts aren't set up on this copy of Hookline yet.";

/** Saves the YouTube channel shown on the dashboard, replacing any earlier one. */
export async function saveChannel(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SIGNED_OUT };

  const input = formData.get("channel");
  const ref = typeof input === "string" ? parseChannelInput(input) : null;
  if (!ref) return { ok: false, error: "Enter your @handle, or paste a link to your channel." };

  try {
    if (!(await getChannelOverview(ref))) {
      return {
        ok: false,
        error: `We couldn't find ${describeChannelRef(ref)} on YouTube. Check the spelling.`,
      };
    }
  } catch (error) {
    console.error("Checking the channel failed:", error);
    return { ok: false, error: "Couldn't reach YouTube just now. Please try again in a minute." };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: NOT_SET_UP };

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    youtube_channel: describeChannelRef(ref),
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error("Saving the channel failed:", error.message);
    return { ok: false, error: "Couldn't save your channel. Please try again." };
  }

  refresh();
  return { ok: true };
}

/** Takes the saved channel off the dashboard. */
export async function removeChannel(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SIGNED_OUT };

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: NOT_SET_UP };

  const { error } = await supabase
    .from("profiles")
    .update({ youtube_channel: null, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) {
    console.error("Removing the channel failed:", error.message);
    return { ok: false, error: "Couldn't remove your channel. Please try again." };
  }

  refresh();
  return { ok: true };
}

/**
 * Deletes the signed-in account for good. The database deletes everything saved with it on its
 * own (see supabase/migrations). Afterwards the browser clears its sign-in cookie.
 */
export async function deleteAccount(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SIGNED_OUT };

  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "Deleting accounts isn't set up on this copy of Hookline yet." };
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Deleting the account failed:", error.message);
    return { ok: false, error: "Couldn't delete your account. Please try again." };
  }

  return { ok: true };
}
