"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/** Shows the first two lines of a long text, with a button to read the rest. */
export function ExpandableText({ text, className }: { text: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 180 || text.split("\n").length > 2;

  return (
    <div className={className}>
      <p
        className={cn(
          "text-sm leading-relaxed wrap-break-word whitespace-pre-line text-muted-foreground",
          isLong && !expanded && "line-clamp-2",
        )}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="mt-1 cursor-pointer rounded-sm text-xs font-medium text-foreground hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
