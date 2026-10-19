export type Theme = "dark" | "light";

/** Key used to remember the visitor's choice in localStorage. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before the first paint so the page never flashes the wrong theme.
 * Dark is the default; light is opt-in through the theme toggle.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")==="light"?"light":"dark";var r=document.documentElement;r.classList.add(t);r.style.colorScheme=t}catch(e){document.documentElement.classList.add("dark")}})();`;

/** The theme currently on the page. Browser only. */
export function getTheme(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

/** Applies a theme instantly and remembers it. Browser only. */
export function applyTheme(theme: Theme) {
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

/** Switches to a theme, cross-fading where the browser supports it. Browser only. */
export function setTheme(theme: Theme) {
  if (document.documentElement.classList.contains(theme)) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "startViewTransition" in document) {
    document.startViewTransition(() => applyTheme(theme));
  } else {
    applyTheme(theme);
  }
}

/** Flips between dark and light. Browser only. */
export function toggleTheme() {
  setTheme(getTheme() === "light" ? "dark" : "light");
}
