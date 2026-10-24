"use client";

import { useId, useState, useTransition } from "react";

import { setFlash } from "@/components/flash-toast";
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
import { deleteAccount } from "@/lib/account/actions";
import { getSupabaseConfig, sessionCookieName } from "@/lib/auth/config";

const CONFIRM_WORD = "delete";

/** The "Delete account" button, with a dialog that asks to type a word first. */
export function DeleteAccountDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </DialogTrigger>
      <DialogContent>
        <DeleteAccountForm />
      </DialogContent>
    </Dialog>
  );
}

function DeleteAccountForm() {
  const id = useId();
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const confirmed = typed.trim().toLowerCase() === CONFIRM_WORD;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteAccount();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // The account and its sessions are gone, so all that's left is this browser's cookie.
      clearSessionCookie();
      setFlash("Your account has been deleted.");
      window.location.replace("/");
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <DialogHeader>
        <DialogTitle>Delete your account?</DialogTitle>
        <DialogDescription>
          This deletes your Hookline account and everything saved in it, for good. It can&apos;t be
          undone. Your Google account and your YouTube channel aren&apos;t affected.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-2">
        <Label htmlFor={id}>
          Type <span className="font-mono text-danger">{CONFIRM_WORD}</span> to confirm
        </Label>
        <Input
          id={id}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={pending}
          className="h-10"
        />
        {error && (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" disabled={pending}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" variant="destructive" disabled={!confirmed} loading={pending}>
          {pending ? "Deleting…" : "Delete account"}
        </Button>
      </DialogFooter>
    </form>
  );
}

/** Removes the sign-in cookie (and its pieces, if it was split) from this browser. */
function clearSessionCookie() {
  const config = getSupabaseConfig();
  if (!config) return;

  const name = sessionCookieName(config);
  for (const cookie of document.cookie.split(";")) {
    const key = cookie.split("=")[0]?.trim() ?? "";
    if (key === name || key.startsWith(`${name}.`)) {
      document.cookie = `${key}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }
}
