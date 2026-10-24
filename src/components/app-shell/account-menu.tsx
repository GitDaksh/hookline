"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut, Palette } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { useTheme } from "@/hooks/use-theme";
import { setTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type AccountUser = {
  name: string;
  /** A second line under the name, like an email or an @handle. */
  detail?: string;
  /** A profile photo. Without one, the first letter of the name shows instead. */
  avatarUrl?: string | null;
};

type AccountMenuProps = {
  user: AccountUser;
  /** Adds "Sign out". Left off for the design preview's demo account. */
  canSignOut?: boolean;
};

export function AccountMenu({ user, canSignOut = false }: AccountMenuProps) {
  const theme = useTheme();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      await createClient()?.auth.signOut({ scope: "local" });
      // A full page load that also drops this page from the back button, so nothing from the
      // signed-in session stays on screen or in memory.
      window.location.replace("/");
    } catch (error) {
      console.error("Sign-out failed:", error);
      setSigningOut(false);
      toast.error("Couldn't sign you out", { description: "Check your connection and try again." });
    }
  }

  return (
    // Not modal: the rest of the page stays usable and visible to screen readers while it's open.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          aria-label="Account menu"
          className="overflow-hidden rounded-full p-0"
        >
          <Avatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar user={user} className="size-9 shrink-0 rounded-full border border-border" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            {user.detail && (
              <p className="truncate text-xs text-subtle-foreground">{user.detail}</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (value === "dark" || value === "light") setTheme(value);
          }}
        >
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/design">
            <Palette />
            Design system
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <ExternalLink />
            Source on GitHub
          </a>
        </DropdownMenuItem>
        {canSignOut && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={signingOut}
              onSelect={(event) => {
                event.preventDefault(); // keep the menu open while it works
                void signOut();
              }}
            >
              <LogOut />
              {signingOut ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** A round profile photo, or the first letter of the name when there's no photo. */
function Avatar({ user, className }: { user: AccountUser; className?: string }) {
  const [broken, setBroken] = useState(false);
  const classes = cn("flex size-full items-center justify-center overflow-hidden", className);

  if (user.avatarUrl && !broken) {
    return (
      <span className={classes}>
        <Image
          src={user.avatarUrl}
          alt=""
          width={36}
          height={36}
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(classes, "bg-secondary text-sm font-semibold text-muted-foreground")}
    >
      {user.name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
