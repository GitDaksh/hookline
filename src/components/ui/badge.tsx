import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-sm border px-2 text-xs font-medium whitespace-nowrap [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-border text-muted-foreground",
        brand: "border-transparent bg-brand/15 text-brand light:bg-brand/10",
        success: "border-transparent bg-success/15 text-success light:bg-success/10",
        warning: "border-transparent bg-warning/15 text-warning light:bg-warning/10",
        danger: "border-transparent bg-danger/15 text-danger light:bg-danger/10",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Show a small dot in the badge's color before the label. */
    dot?: boolean;
  };

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
