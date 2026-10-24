"use client";

import { useEffect } from "react";
import { RotateCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChannelMessage } from "@/components/youtube/channel-message";

/** Shown when a signed-in page fails to load, for example when the database doesn't answer. */
export default function AppError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ChannelMessage
      icon={TriangleAlert}
      title="This page didn't load"
      description="Something went wrong on Hookline's side. Check your connection, then try again in a moment."
    >
      <Button onClick={() => retry()}>
        <RotateCw />
        Try again
      </Button>
    </ChannelMessage>
  );
}
