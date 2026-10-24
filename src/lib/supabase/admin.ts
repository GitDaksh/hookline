import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/auth/config";

/**
 * A Supabase client with full access, only for the few jobs that need it, like deleting an
 * account. It uses the secret key, which must never reach the browser: it's only read here, on
 * the server, and its name has no NEXT_PUBLIC_ prefix. Returns null when it isn't set up.
 */
export function createAdminClient() {
  const config = getSupabaseConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!config || !secretKey) return null;

  return createClient(config.url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
