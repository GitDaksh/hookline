"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, House, LayoutDashboard, Palette, Search, SunMoon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { siteConfig } from "@/config/site";
import { toggleTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type CommandMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

/** Gives every page a ⌘K / Ctrl+K command menu. */
export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <CommandMenuContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu open={open} onOpenChange={setOpen} />
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (!context) {
    throw new Error("useCommandMenu must be used inside <CommandMenuProvider>.");
  }
  return context;
}

const subscribeToNothing = () => () => {};

/** True on Apple devices. The server assumes Mac, then the browser corrects it after loading. */
function useIsMac() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent),
    () => true,
  );
}

function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  function run(action: () => void) {
    onOpenChange(false);
    action();
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages and actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => run(() => router.push("/"))}>
            <House />
            Home
          </CommandItem>
          <CommandItem
            keywords={["overview", "analytics", "stats"]}
            onSelect={() => run(() => router.push("/design/dashboard"))}
          >
            <LayoutDashboard />
            Dashboard preview
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/design"))}>
            <Palette />
            Design system
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem keywords={["dark", "light", "mode"]} onSelect={() => run(toggleTheme)}>
            <SunMoon />
            Switch theme
          </CommandItem>
          <CommandItem
            keywords={["code", "repository", "open source"]}
            onSelect={() =>
              run(() => window.open(siteConfig.links.github, "_blank", "noopener,noreferrer"))
            }
          >
            <ExternalLink />
            View source on GitHub
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFooter />
    </CommandDialog>
  );
}

/** A search field look-alike that opens the command menu. Shrinks to an icon on phones. */
export function SearchButton({ className }: { className?: string }) {
  const { setOpen } = useCommandMenu();
  const isMac = useIsMac();

  return (
    <Button
      variant="secondary"
      onClick={() => setOpen(true)}
      aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
      className={cn(
        "w-9 gap-2 px-0 font-normal text-muted-foreground hover:text-foreground sm:w-56 sm:justify-start sm:px-3",
        className,
      )}
    >
      <Search />
      {/* Screen readers always hear "Search…". On phones the word is visually hidden. */}
      <span className="sr-only sm:not-sr-only sm:flex-1 sm:text-left">Search…</span>
      <Kbd aria-hidden="true" className="hidden sm:inline-flex">
        {isMac ? "⌘K" : "Ctrl K"}
      </Kbd>
    </Button>
  );
}
