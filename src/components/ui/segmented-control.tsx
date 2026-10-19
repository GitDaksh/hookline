"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

function SegmentedControl({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="segmented-control"
      orientation="horizontal"
      className={cn(
        "inline-flex h-9 items-center gap-0.5 rounded-lg border border-border bg-card p-[3px] light:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function SegmentedControlItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="segmented-control-item"
      className={cn(
        "inline-flex h-full cursor-pointer items-center justify-center gap-1.5 rounded-[6px] px-3 text-[13px] font-medium whitespace-nowrap text-muted-foreground",
        "transition-[color,background-color,box-shadow] duration-150 ease-smooth hover:text-foreground",
        "data-[state=checked]:bg-accent data-[state=checked]:text-foreground",
        "light:data-[state=checked]:bg-card light:data-[state=checked]:shadow-[0_1px_2px_rgb(16_16_20/0.08)]",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export { SegmentedControl, SegmentedControlItem };
