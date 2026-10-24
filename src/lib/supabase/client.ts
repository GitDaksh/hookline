import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/lib/auth/config";

/**
 * A Supabase client for the browser. Hookline only uses it for the moment of signing in or out,
 * and the page reloads right after, so it doesn't refresh sessions in the background (the proxy
 * does that). Returns null when sign-in isn't set up.
 */
export function createClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  return createBrowserClient(config.url, config.publishableKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false },
  });
}
