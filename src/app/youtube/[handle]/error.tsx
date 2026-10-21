"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChannelMessage } from "@/components/youtube/channel-message";

export default function ChannelError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ChannelMessage
      icon={TriangleAlert}
      title="We couldn't load this channel"
      description="YouTube didn't answer, or Hookline has used up its YouTube requests for today. Try again in a minute, or later today."
    >
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => retry()}>
          <RotateCw />
          Try again
        </Button>
        <Button asChild variant="secondary">
          <Link href="/youtube">Look up another channel</Link>
        </Button>
      </div>
    </ChannelMessage>
  );
}
