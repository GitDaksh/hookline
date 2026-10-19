import { cn } from "@/lib/utils";

function LogoMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("size-6", className)} {...props}>
      <rect width="64" height="64" rx="16" className="fill-brand" />
      <path
        d="M42 15v23a10 10 0 0 1-20 0v-4"
        fill="none"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-brand-foreground"
      />
    </svg>
  );
}

function Logo({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      <LogoMark />
      Hookline
    </span>
  );
}

export { Logo, LogoMark };
