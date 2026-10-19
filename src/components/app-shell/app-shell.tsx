import type { AccountUser } from "@/components/app-shell/account-menu";
import { AppHeader, type NavItem } from "@/components/app-shell/app-header";

type AppShellProps = {
  nav: readonly NavItem[];
  user: AccountUser;
  children: React.ReactNode;
};

/** The frame around every signed-in page: top bar, then the page in a centered column. */
export function AppShell({ nav, user, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <AppHeader nav={nav} user={user} />
      <main id="main" className="mx-auto w-full max-w-[1120px] flex-1 px-4 pt-8 pb-16 sm:px-6">
        {children}
      </main>
    </div>
  );
}
