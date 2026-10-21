import { SiteShell } from "@/components/site/site-shell";

export default function YouTubeLayout({ children }: LayoutProps<"/youtube">) {
  return <SiteShell>{children}</SiteShell>;
}
