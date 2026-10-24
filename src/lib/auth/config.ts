/**
 * Settings for signing in. All three values are public by design: the Supabase URL and
 * publishable key only allow what the database's own rules allow, and a Google client ID is
 * meant to be seen. They're read with their full names so Next.js can build them into the
 * browser code.
 */
export type SupabaseConfig = { url: string; publishableKey: string };

/** The Supabase project that holds accounts, or null when it isn't set up. */
export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey || !isWebUrl(url)) return null;
  return { url, publishableKey };
}

/** The Google client the "Continue with Google" button belongs to, or null. */
export function getGoogleClientId(): string | null {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || null;
}

/**
 * The cookie that holds a signed-in session. Supabase names it after the project
 * (sb-<project>-auth-token) and splits a big one into name.0, name.1, and so on.
 */
export function sessionCookieName(config: SupabaseConfig): string {
  return `sb-${new URL(config.url).hostname.split(".")[0]}-auth-token`;
}

function isWebUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
