"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-[6px] border border-transparent bg-input p-0.5",
        "transition-colors duration-150 ease-smooth data-[state=checked]:bg-brand",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-3.5 rounded-[4px] bg-foreground shadow-sm light:bg-card",
          "transition-transform duration-200 ease-smooth data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
          "data-[state=checked]:bg-brand-foreground light:data-[state=checked]:bg-brand-foreground",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
