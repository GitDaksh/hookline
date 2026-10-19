"use client";

import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      gap={8}
      icons={{
        success: <CircleCheck className="size-4 text-success" />,
        error: <CircleAlert className="size-4 text-danger" />,
        warning: <TriangleAlert className="size-4 text-warning" />,
        info: <Info className="size-4 text-brand" />,
        loading: <LoaderCircle className="size-4 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans! shadow-lg!",
          title: "text-sm! font-medium!",
          description: "text-[13px]! text-muted-foreground!",
          actionButton:
            "h-7! rounded-md! bg-primary! px-2.5! text-xs! font-medium! text-primary-foreground!",
          cancelButton: "h-7! rounded-md! bg-muted! px-2.5! text-xs! text-muted-foreground!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
