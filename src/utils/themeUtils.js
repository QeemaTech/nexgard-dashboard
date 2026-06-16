export const THEME_STORAGE_KEY = "nex-dashboard-theme";

function resolveTheme(stored) {
  if (stored === "dark" || stored === "light") return stored;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  return resolveTheme(localStorage.getItem(THEME_STORAGE_KEY));
}

export function applyThemeToDocument(theme) {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.dataset.theme = theme;
  root.style.colorScheme = isDark ? "dark" : "light";
  root.classList.remove("dark", "light");
  root.classList.add(isDark ? "dark" : "light");

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
