import Link from "next/link";

/** A plain, readable page for long text like the Terms and the Privacy Policy. */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  /** When the text last changed, like "October 21, 2026". */
  updated: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl py-4 sm:py-8">
      <p className="text-[13px] text-subtle-foreground">Last updated {updated}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{intro}</div>
      <div className="mt-10 grid gap-10">{children}</div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 text-[15px] leading-relaxed text-muted-foreground">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="grid list-disc gap-2 pl-5 marker:text-subtle-foreground">{children}</ul>;
}

const linkClass =
  "rounded-sm font-medium text-foreground underline decoration-subtle-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground";

/** An underlined link inside the text. Links to other sites open in a new tab. */
export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
      {children}
    </a>
  );
}
