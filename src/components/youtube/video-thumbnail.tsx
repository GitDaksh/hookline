import Image from "next/image";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

// Pictures load straight from YouTube's servers. `unoptimized` skips Vercel's image resizing,
// which has a small free monthly limit; YouTube already serves them at the right size.

/** A 16:9 video thumbnail with a quiet placeholder. */
export function VideoThumbnail({ src, className }: { src: string | null; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-video shrink-0 overflow-hidden rounded-md bg-accent ring-1 ring-border ring-inset",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          referrerPolicy="no-referrer"
          sizes="160px"
          className="object-cover"
        />
      ) : (
        <Play
          aria-hidden="true"
          className="absolute inset-0 m-auto size-4 text-subtle-foreground"
        />
      )}
    </div>
  );
}

/** A round channel picture, or the first letter of the name if there isn't one. */
export function ChannelAvatar({
  src,
  name,
  className,
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-accent ring-1 ring-border",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          referrerPolicy="no-referrer"
          sizes="80px"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-muted-foreground"
        >
          {name.trim().charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
