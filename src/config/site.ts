export const siteConfig = {
  name: "Hookline",
  tagline: "Write the hook. Watch the line climb.",
  description:
    "A free, open-source analytics and content studio for creators. Plan, script and publish, then see what actually works.",
  links: {
    github: "https://github.com/GitDaksh/hookline",
  },
} as const;

/**
 * Absolute URL of the site. Server-only: Vercel's system variables
 * aren't available in the browser.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
