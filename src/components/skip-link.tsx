"use client";

/**
 * "Skip to content" for keyboard users: the first thing Tab reaches on a page. Pages you've left
 * stay in the document (hidden) so Next can restore them instantly, so this looks for the <main>
 * that's actually on screen instead of trusting the first #main it finds.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(event) => {
        const main = Array.from(document.querySelectorAll<HTMLElement>("main")).find(
          (element) => element.getClientRects().length > 0,
        );
        if (!main) return;
        event.preventDefault();
        main.focus();
      }}
      className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  );
}
