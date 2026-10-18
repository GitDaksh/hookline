"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (e.g. private mode). The theme still applies for this visit.
  }
}

export function ThemeToggle() {
  function toggleTheme() {
    const next: Theme = document.documentElement.classList.contains("light") ? "dark" : "light";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cross-fade the whole page between themes where the browser supports it.
    if (!reduceMotion && "startViewTransition" in document) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Switch between dark and light theme"
      title="Switch theme"
    >
      <Sun className="light:hidden" />
      <Moon className="hidden light:block" />
    </Button>
  );
}
