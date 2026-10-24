/** Where people land after signing in, unless they were on their way somewhere else. */
export const DEFAULT_SIGNED_IN_PATH = "/dashboard";

// A made-up origin to resolve paths against. Anything that resolves elsewhere is rejected.
const BASE = "https://hookline.invalid";

/**
 * Turns a ?next= value into a safe place to go after signing in: a page on this site.
 * Links to other sites, and tricks like "//evil.com" or "/\evil.com", fall back to the dashboard.
 */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) return DEFAULT_SIGNED_IN_PATH;

  try {
    const url = new URL(value, BASE);
    const path = `${url.pathname}${url.search}${url.hash}`;
    const safe = url.origin === BASE && !path.startsWith("//") && url.pathname !== "/sign-in";
    return safe ? path : DEFAULT_SIGNED_IN_PATH;
  } catch {
    return DEFAULT_SIGNED_IN_PATH;
  }
}

/** The sign-in page, remembering where to go afterwards. */
export function signInPath(next?: string): string {
  const target = safeNextPath(next);
  return target === DEFAULT_SIGNED_IN_PATH
    ? "/sign-in"
    : `/sign-in?next=${encodeURIComponent(target)}`;
}
