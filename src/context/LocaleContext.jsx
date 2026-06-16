import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALES, translate } from "../i18n";

const LocaleContext = createContext(null);

const LOCALE_SWITCH_MS = {
  exit: 220,
  enter: 380
};

function getInitialLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return LOCALES[stored] ? stored : DEFAULT_LOCALE;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);
  const [phase, setPhase] = useState("idle");
  const animatingRef = useRef(false);

  const dir = LOCALES[locale]?.dir || "ltr";
  const isRtl = dir === "rtl";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
    root.dataset.locale = locale;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, dir]);

  const setLocale = useCallback(
    (next) => {
      if (!LOCALES[next] || next === locale || animatingRef.current) return;

      if (prefersReducedMotion()) {
        setLocaleState(next);
        return;
      }

      const root = document.documentElement;
      root.dataset.localeFrom = locale;
      root.dataset.localeTo = next;
      animatingRef.current = true;
      setPhase("exit");

      window.setTimeout(() => {
        setLocaleState(next);
        setPhase("enter");

        window.setTimeout(() => {
          setPhase("idle");
          animatingRef.current = false;
          delete root.dataset.localeFrom;
          delete root.dataset.localeTo;
        }, LOCALE_SWITCH_MS.enter);
      }, LOCALE_SWITCH_MS.exit);
    },
    [locale]
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  const t = useCallback(
    (key, fallbackOrVars, maybeVars) => translate(locale, key, fallbackOrVars, maybeVars),
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      dir,
      isRtl,
      phase,
      isLocaleAnimating: phase !== "idle",
      setLocale,
      toggleLocale,
      t,
      locales: LOCALES
    }),
    [locale, dir, isRtl, phase, setLocale, toggleLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>
      <div className={`locale-transition-root locale-phase-${phase}`}>{children}</div>
      {phase !== "idle" ? <div className="locale-switch-flash" aria-hidden="true" /> : null}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

export default LocaleContext;
