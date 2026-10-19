"use client";

import Link from "next/link";
import { ExternalLink, Palette } from "lucide-react";

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

export type AccountUser = {
  name: string;
  /** A second line under the name, like an @handle or an email. */
  detail?: string;
};

export function AccountMenu({ user }: { user: AccountUser }) {
  const theme = useTheme();
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          aria-label="Account menu"
          className="font-semibold text-muted-foreground hover:text-foreground"
        >
          {initial}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-medium">{user.name}</p>
          {user.detail && <p className="truncate text-xs text-subtle-foreground">{user.detail}</p>}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
