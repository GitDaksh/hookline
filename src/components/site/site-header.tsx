"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ChannelSearch } from "@/components/youtube/channel-search";

/** The top bar for public pages: logo, a channel search box and the theme switch. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 shadow-[inset_0_-1px_0_var(--border)] backdrop-blur-md">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Hookline home" className="flex items-center rounded-md">
          <Logo />
        </Link>
        <div className="ml-auto flex items-center gap-1.5">
          {/* Pages with unknown URL parts only learn their path on the visit, so they show the
              search box until then. */}
          <Suspense fallback={<HeaderSearch />}>
            <HeaderSearchUnlessSearchPage />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

// The lookup page has its own big search box, so a second one up here would be a duplicate.
function HeaderSearchUnlessSearchPage() {
  return usePathname() === "/youtube" ? null : <HeaderSearch />;
}

function HeaderSearch() {
  return (
    <>
      <ChannelSearch variant="compact" className="hidden w-72 md:block" />
      <Button asChild variant="ghost" size="icon" className="md:hidden">
        <Link href="/youtube" aria-label="Look up a channel">
          <Search />
        </Link>
      </Button>
    </>
  );
}
