import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-md border border-input bg-card px-3 py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-subtle-foreground",
        "transition-[border-color,box-shadow] duration-150 ease-smooth",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
        "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
