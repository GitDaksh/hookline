import type { AccountUser } from "@/components/app-shell/account-menu";
import { AppHeader, type NavItem } from "@/components/app-shell/app-header";
import { SkipLink } from "@/components/skip-link";

type AppShellProps = {
  nav: readonly NavItem[];
  user: AccountUser;
  children: React.ReactNode;
};

/** The frame around every signed-in page: top bar, then the page in a centered column. */
export function AppShell({ nav, user, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <AppHeader nav={nav} user={user} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-280 flex-1 px-4 pt-8 pb-16 outline-none sm:px-6"
      >
        {children}
      </main>
    </div>
  );
}
