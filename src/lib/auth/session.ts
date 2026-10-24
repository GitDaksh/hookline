import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { JwtPayload } from "@supabase/supabase-js";

import { signInPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

/** Just what the app needs about the signed-in person. Never the session itself. */
export type CurrentUser = {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
};

/**
 * The signed-in person, or null. The session's signature is checked on the server, so this can
 * be trusted. It runs once per request, however many components ask for it.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;

  return toCurrentUser(data.claims);
});

/** The signed-in person. Anyone else is sent to the sign-in page, and back to `path` after. */
export async function requireUser(path: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(signInPath(path));
  return user;
}

function toCurrentUser(claims: JwtPayload): CurrentUser {
  // Google fills these in when someone signs in. People could change them, so check each one.
  const profile: Record<string, unknown> = claims.user_metadata ?? {};
  const email = text(claims.email) ?? text(profile.email);

  return {
    id: claims.sub,
    name: text(profile.full_name) ?? text(profile.name) ?? email?.split("@")[0] ?? "Creator",
    email,
    avatarUrl: httpsUrl(profile.avatar_url) ?? httpsUrl(profile.picture),
  };
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function httpsUrl(value: unknown): string | null {
  const url = text(value);
  return url?.startsWith("https://") ? url : null;
}
