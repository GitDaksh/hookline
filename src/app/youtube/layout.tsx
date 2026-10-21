import { SiteHeader } from "@/components/site/site-header";

export default function YouTubeLayout({ children }: LayoutProps<"/youtube">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-280 flex-1 px-4 pt-8 pb-16 sm:px-6">
        {children}
      </main>
    </div>
  );
}
