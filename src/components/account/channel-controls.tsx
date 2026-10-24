"use client";

import { useId, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeChannel, saveChannel } from "@/lib/account/actions";
import { describeChannelRef, parseChannelInput } from "@/lib/youtube/handle";

const HELP = "Enter your @handle, or paste a link to your channel.";

type ChannelDialogProps = {
  /** The saved channel, like "@mkbhd", or null when there isn't one yet. */
  current: string | null;
  /** The button that opens the dialog. */
  children: React.ReactNode;
};

/** A dialog to add or change the YouTube channel shown on the dashboard. */
export function ChannelDialog({ current, children }: ChannelDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {/* Lives inside the dialog, so it starts fresh every time the dialog opens. */}
        <ChannelForm current={current} onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ChannelForm({ current, onSaved }: { current: string | null; onSaved: () => void }) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ref = parseChannelInput(String(formData.get("channel") ?? ""));
    if (!ref) {
      setError(HELP);
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await saveChannel(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onSaved();
      toast.success("Channel saved", {
        description: `${describeChannelRef(ref)} is on your dashboard now.`,
      });
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <DialogHeader>
        <DialogTitle>{current ? "Change your channel" : "Add your YouTube channel"}</DialogTitle>
        <DialogDescription>
          Paste a link to your channel, or type your @handle. Your dashboard will show its public
          numbers.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-2">
        <Label htmlFor={id}>Your channel</Label>
        <Input
          id={id}
          name="channel"
          defaultValue={current ?? ""}
          placeholder="@yourhandle or youtube.com/@yourhandle"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-10"
        />
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button type="submit" loading={pending}>
          {pending ? "Saving…" : "Save channel"}
        </Button>
      </DialogFooter>
    </form>
  );
}

/** Takes the saved channel off the dashboard. It's easy to add back, so there's no extra step. */
export function RemoveChannelButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await removeChannel();
          if (result.ok) toast.success("Channel removed");
          else toast.error(result.error);
        })
      }
    >
      Remove
    </Button>
  );
}
