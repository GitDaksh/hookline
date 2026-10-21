"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { channelPath, parseChannelInput } from "@/lib/youtube/handle";
import { cn } from "@/lib/utils";

const HELP = "Enter a handle like @mkbhd, or paste a link to the channel.";

type ChannelSearchProps = {
  /** "hero" is the big search box; "compact" fits in a top bar. */
  variant?: "hero" | "compact";
  defaultValue?: string;
  className?: string;
};

/** A search box that takes a YouTube @handle or channel link and opens that channel's page. */
export function ChannelSearch({
  variant = "hero",
  defaultValue = "",
  className,
}: ChannelSearchProps) {
  const router = useRouter();
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const compact = variant === "compact";

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ref = parseChannelInput(value);
    if (!ref) {
      if (compact) toast.error("That doesn't look like a channel", { description: HELP });
      else setError(HELP);
      return;
    }
    setError(null);
    startTransition(() => router.push(channelPath(ref)));
  }

  return (
    <form
      role="search"
      // Two of these can be on one page (top bar and page), so each gets its own name.
      aria-label={compact ? "Quick channel lookup" : "Channel lookup"}
      onSubmit={onSubmit}
      className={cn("w-full", className)}
      noValidate
    >
      <div className={cn("flex gap-2", compact ? "items-center" : "flex-col sm:flex-row")}>
        <label htmlFor={id} className="sr-only">
          YouTube handle or channel link
        </label>
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle-foreground",
              compact ? "size-4" : "size-4.5",
            )}
          />
          <Input
            id={id}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
            placeholder={compact ? "Look up a channel…" : "@handle or channel link"}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(compact ? "h-9 pl-9" : "h-11 pl-10 text-[15px]")}
          />
        </div>
        {!compact && (
          <Button type="submit" size="lg" loading={isPending} className="h-11 px-5">
            Look up
            {!isPending && <ArrowRight />}
          </Button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-left text-xs text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
