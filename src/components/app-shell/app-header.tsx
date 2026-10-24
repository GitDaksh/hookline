"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { SearchButton } from "@/components/command-menu";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  href: string;
  /** Not built yet: shows as a dimmed tab with a "Soon" tag instead of a link. */
  soon?: boolean;
};

type AppHeaderProps = {
  nav: readonly NavItem[];
  /** The account button at the right end. */
  account: React.ReactNode;
};

export function AppHeader({ nav, account }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 shadow-[inset_0_-1px_0_var(--border)] backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-x-7 px-4 sm:px-6">
        <Link href="/" aria-label="Hookline home" className="flex h-14 items-center rounded-md">
          <Logo />
        </Link>

        {/* Phones: its own row that scrolls sideways. Laptops: inline next to the logo. */}
        <nav
          aria-label="Main"
          className="order-last -mx-4 flex w-[calc(100%+2rem)] scrollbar-none gap-6 overflow-x-auto px-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 md:order-0 md:mx-0 md:w-auto md:gap-5 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {/* Pages with unknown URL parts can't know the active tab until the visit, so the
              tabs show without the underline until then. */}
          <Suspense fallback={<NavLinks nav={nav} pathname={null} />}>
            <ActiveNavLinks nav={nav} />
          </Suspense>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchButton className="sm:w-48" />
          {account}
        </div>
      </div>
    </header>
  );
}

function ActiveNavLinks({ nav }: { nav: readonly NavItem[] }) {
  return <NavLinks nav={nav} pathname={usePathname()} />;
}

function NavLinks({ nav, pathname }: { nav: readonly NavItem[]; pathname: string | null }) {
  return nav.map((item) => {
    if (item.soon) {
      return (
        <span
          key={item.href}
          className="flex h-11 shrink-0 cursor-default items-center gap-1.5 text-sm text-subtle-foreground md:h-14"
        >
          {item.label}
          <span className="rounded-sm border border-border px-1 text-[10px] leading-4 font-medium">
            Soon
          </span>
        </span>
      );
    }

    const active =
      pathname !== null && (pathname === item.href || pathname.startsWith(`${item.href}/`));

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex h-11 shrink-0 items-center text-sm font-medium transition-colors duration-150 focus-visible:-outline-offset-2 md:h-14",
          active
            ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
      </Link>
    );
  });
}
