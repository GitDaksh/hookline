import type { Metadata } from "next";
import { Suspense } from "react";

import { ChannelDialog, RemoveChannelButton } from "@/components/account/channel-controls";
import { DeleteAccountDialog } from "@/components/account/delete-account";
import { UserAvatar } from "@/components/app-shell/account-menu";
import { PageHeader } from "@/components/app-shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSavedChannel } from "@/lib/account/data";
import { requireUser } from "@/lib/auth/session";
import { describeChannelRef } from "@/lib/youtube/handle";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <div className="grid max-w-2xl grid-cols-1 gap-6">
      <PageHeader title="Settings" description="Your account and your saved channel." />
      <Suspense fallback={<SettingsSkeleton />}>
        <Settings />
      </Suspense>
    </div>
  );
}

async function Settings() {
  const user = await requireUser("/settings");
  const channel = await getSavedChannel(user.id);
  const handle = channel ? describeChannelRef(channel) : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>From the Google account you signed in with.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <UserAvatar
            user={{ name: user.name, avatarUrl: user.avatarUrl }}
            className="size-12 shrink-0 rounded-full border border-border"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            {user.email && (
              <p className="truncate text-[13px] text-muted-foreground">{user.email}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>YouTube channel</CardTitle>
          <CardDescription>The channel your dashboard shows.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          {handle ? (
            <p className="min-w-0 text-sm font-medium wrap-break-word">{handle}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No channel yet.</p>
          )}
          <div className="flex items-center gap-2">
            {handle && <RemoveChannelButton />}
            <ChannelDialog current={handle}>
              <Button variant="secondary">{handle ? "Change" : "Add channel"}</Button>
            </ChannelDialog>
          </div>
        </CardContent>
      </Card>

      <Card className="border-danger/30">
        <CardHeader>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>
            Deletes your Hookline account and everything saved in it, for good. Your Google account
            and your YouTube channel aren&apos;t affected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </>
  );
}

function SettingsSkeleton() {
  return (
    <div role="status" className="grid grid-cols-1 gap-6">
      <span className="sr-only">Loading your settings…</span>
      {[0, 1, 2].map((index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full max-w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full max-w-80" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
