import type { Metadata } from "next";

import { AccountMenu } from "@/components/app-shell/account-menu";
import type { NavItem } from "@/components/app-shell/app-header";
import { AppShell } from "@/components/app-shell/app-shell";

import { DashboardPreview } from "./dashboard-preview";

export const metadata: Metadata = {
  title: "Dashboard preview",
  description: "A preview of the Hookline dashboard, filled with sample data.",
  robots: { index: false, follow: false },
};

const previewNav: NavItem[] = [
  { label: "Overview", href: "/design/dashboard" },
  { label: "Content", href: "/content", soon: true },
  { label: "Studio", href: "/studio", soon: true },
  { label: "Calendar", href: "/calendar", soon: true },
];

const previewUser = { name: "Demo creator", detail: "@hookline.demo" };

export default function DashboardPreviewPage() {
  return (
    <AppShell nav={previewNav} account={<AccountMenu user={previewUser} />}>
      <DashboardPreview />
    </AppShell>
  );
}
