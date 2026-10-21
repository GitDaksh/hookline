import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SkipLink } from "@/components/skip-link";

/** The frame around public pages: top bar, the page in a centered column, then the footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-280 flex-1 px-4 pt-8 pb-16 outline-none sm:px-6"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
