import { AppHeader, type NavItem } from "@/components/app-shell/app-header";
import { SkipLink } from "@/components/skip-link";

type AppShellProps = {
  nav: readonly NavItem[];
  /** The account button at the right end of the top bar. */
  account: React.ReactNode;
  children: React.ReactNode;
};

/** The frame around every signed-in page: top bar, then the page in a centered column. */
export function AppShell({ nav, account, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <AppHeader nav={nav} account={account} />
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
