"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const KEY = "hookline:flash";

/** Saves a message to show as a toast after the next full page load, like "You're signed out". */
export function setFlash(message: string) {
  try {
    sessionStorage.setItem(KEY, message);
  } catch {
    // Storage can be blocked (some private windows). The message is just skipped.
  }
}

/** Shows a message saved with setFlash, once. Goes after the <Toaster /> in the layout. */
export function FlashToast() {
  useEffect(() => {
    let message: string | null = null;
    try {
      message = sessionStorage.getItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {
      return;
    }
    if (message) toast.success(message);
  }, []);

  return null;
}
