import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { applyThemeToDocument, getInitialTheme } from "../utils/themeUtils";

const ThemeContext = createContext(null);

const THEME_SWITCH_MS = {
  exit: 240,
  enter: 400
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [phase, setPhase] = useState("idle");
  const animatingRef = useRef(false);

  useEffect(() => {
    if (phase !== "idle") return;
    applyThemeToDocument(theme);
  }, [theme, phase]);

  const setTheme = useCallback(
    (next) => {
      if (next !== "dark" && next !== "light") return;
      if (next === theme || animatingRef.current) return;

      if (prefersReducedMotion()) {
        setThemeState(next);
        applyThemeToDocument(next);
        return;
      }

      const root = document.documentElement;
      root.dataset.themeFrom = theme;
      root.dataset.themeTo = next;
      animatingRef.current = true;
      setPhase("exit");

      window.setTimeout(() => {
        setThemeState(next);
        applyThemeToDocument(next);
        setPhase("enter");

        window.setTimeout(() => {
          setPhase("idle");
          animatingRef.current = false;
          delete root.dataset.themeFrom;
          delete root.dataset.themeTo;
        }, THEME_SWITCH_MS.enter);
      }, THEME_SWITCH_MS.exit);
    },
    [theme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      phase,
      isThemeAnimating: phase !== "idle",
      setTheme,
      toggleTheme
    }),
    [theme, phase, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-transition-root theme-phase-${phase}`}>{children}</div>
      {phase !== "idle" ? <div className="theme-switch-flash" aria-hidden="true" /> : null}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export default ThemeContext;
