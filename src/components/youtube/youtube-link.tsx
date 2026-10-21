import { ArrowUpRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function youtubeChannelUrl(channel: { id: string; handle: string | null }): string {
  return channel.handle
    ? `https://www.youtube.com/${encodeURIComponent(channel.handle).replace("%40", "@")}`
    : `https://www.youtube.com/channel/${encodeURIComponent(channel.id)}`;
}

export function youtubeVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}

/**
 * YouTube's full-color icon, drawn from the official artwork (via Simple Icons). YouTube's brand
 * rules: keep the red and the white triangle as they are, show it at least 20px tall, and leave
 * free space around it at least as big as the triangle.
 */
export function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 3.545 24 16.91"
      aria-hidden="true"
      focusable="false"
      className={cn("h-5 w-auto shrink-0", className)}
    >
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      />
      <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/**
 * "Open on YouTube" with YouTube's icon. YouTube's API rules ask apps to show their brand next to
 * YouTube data and to link it back to YouTube, so keep this on every page that shows their data.
 */
export function YouTubeLink({ href, className }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "gap-2.5", className)}
    >
      {/* The ! makes these sizes win over the button's own icon size. */}
      <YouTubeIcon className="h-5! w-auto!" />
      Open on YouTube
      <ArrowUpRight className="text-muted-foreground" />
    </a>
  );
}
