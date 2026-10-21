import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const linkClass =
  "rounded-sm text-muted-foreground transition-colors duration-150 hover:text-foreground";

/** The bottom of every public page: what Hookline is, plus Terms, Privacy and the code. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("shadow-[inset_0_1px_0_var(--border)]", className)}>
      <div className="mx-auto flex w-full max-w-280 flex-col gap-3 px-4 py-6 text-xs text-subtle-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {siteConfig.name} is free and open source. It isn&apos;t affiliated with YouTube or
          Google.
        </p>
        <nav aria-label="Footer">
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/terms" className={linkClass}>
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={linkClass}>
                Privacy
              </Link>
            </li>
            <li>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
