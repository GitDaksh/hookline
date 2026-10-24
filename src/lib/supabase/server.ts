import "server-only";

import { createServerClient } from "@supabase/ssr";
import { io } from "next/cache";
import { cookies } from "next/headers";

import { getSupabaseConfig } from "@/lib/auth/config";

/**
 * A Supabase client for server code, acting as whoever sent the request. Make a new one for
 * every request. Returns null when sign-in isn't set up.
 */
export async function createClient() {
  // Checking a session means comparing its expiry with the clock, so it can only happen during
  // a real visit. io() tells Next.js not to try any of this ahead of time. It runs even when
  // sign-in isn't set up, so pages behave the same either way.
  await io();
  const config = getSupabaseConfig();
  if (!config) return null;

  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Pages can't change cookies, and don't need to: the proxy (src/proxy.ts) already
          // refreshed the session before the page started.
        }
      },
    },
  });
}