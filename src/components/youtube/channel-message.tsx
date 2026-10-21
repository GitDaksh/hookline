import type { LucideIcon } from "lucide-react";

type ChannelMessageProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** What to do next: a search box or buttons. */
  children?: React.ReactNode;
};

/** A calm, centered message for when a channel can't be shown. */
export function ChannelMessage({ icon: Icon, title, description, children }: ChannelMessageProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-12 text-center sm:py-20">
      <div className="flex size-12 items-center justify-center rounded-full border border-border bg-card">
        <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
      </div>
      <h1 className="mt-5 text-xl font-semibold tracking-tight wrap-break-word">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
        {description}
      </p>
      {children && <div className="mt-8 flex w-full flex-col items-center">{children}</div>}
    </div>
  );
}
