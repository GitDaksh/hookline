export type Theme = "dark" | "light";

/** Key used to remember the visitor's choice in localStorage. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before the first paint so the page never flashes the wrong theme.
 * Dark is the default; light is opt-in through the theme toggle.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")==="light"?"light":"dark";var r=document.documentElement;r.classList.add(t);r.style.colorScheme=t}catch(e){document.documentElement.classList.add("dark")}})();`;
