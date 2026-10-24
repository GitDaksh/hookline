import { Suspense } from "react";

import { AccountMenu } from "@/components/app-shell/account-menu";
import type { NavItem } from "@/components/app-shell/app-header";
import { AppShell } from "@/components/app-shell/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/session";

const appNav: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Content", href: "/content", soon: true },
  { label: "Studio", href: "/studio", soon: true },
  { label: "Calendar", href: "/calendar", soon: true },
];

/** The frame around every signed-in page. Each page checks the session for itself. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      nav={appNav}
      account={
        <Suspense fallback={<AccountSkeleton />}>
          <CurrentAccountMenu />
        </Suspense>
      }
    >
      {children}
    </AppShell>
  );
}

async function CurrentAccountMenu() {
  const user = await getCurrentUser();
  // Not signed in: the page itself sends people to the sign-in page.
  if (!user) return <AccountSkeleton />;

  return (
    <AccountMenu
      user={{ name: user.name, detail: user.email ?? undefined, avatarUrl: user.avatarUrl }}
      signedIn
    />
  );
}

function AccountSkeleton() {
  return <Skeleton className="size-9 rounded-full" />;
}
