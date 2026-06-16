import { Moon, Sun } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import useTranslation from "../../hooks/useTranslation";

function ThemeControls({ compact = false }) {
  const { isDark, setTheme, isThemeAnimating } = useTheme();
  const { locale, setLocale, t, locales, isLocaleAnimating } = useTranslation();
  const localeCodes = Object.keys(locales);
  const controlsLocked = isThemeAnimating || isLocaleAnimating;

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <div
        className="theme-mode-track theme-toggle-track relative flex items-center gap-1 rounded-2xl p-1"
        role="group"
        aria-label={isDark ? t("topbar.lightMode") : t("topbar.darkMode")}
      >
        <span
          className={`theme-mode-pill ${isDark ? "theme-mode-pill--dark" : "theme-mode-pill--light"}`}
          aria-hidden="true"
        />
        <button
          type="button"
          disabled={controlsLocked}
          onClick={() => setTheme("light")}
          aria-pressed={!isDark}
          className={`theme-mode-btn relative z-[1] inline-flex min-w-[3.75rem] items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors duration-300 ${
            !isDark ? "text-slate-900" : "theme-toggle-idle"
          } ${controlsLocked ? "pointer-events-none opacity-90" : ""}`}
          title={t("topbar.lightMode")}
        >
          <Sun className="h-3.5 w-3.5" />
          {!compact ? <span>{t("topbar.light")}</span> : null}
        </button>
        <button
          type="button"
          disabled={controlsLocked}
          onClick={() => setTheme("dark")}
          aria-pressed={isDark}
          className={`theme-mode-btn relative z-[1] inline-flex min-w-[3.75rem] items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors duration-300 ${
            isDark ? "text-white" : "theme-toggle-idle"
          } ${controlsLocked ? "pointer-events-none opacity-90" : ""}`}
          title={t("topbar.darkMode")}
        >
          <Moon className="h-3.5 w-3.5" />
          {!compact ? <span>{t("topbar.dark")}</span> : null}
        </button>
      </div>

      <div
        className="locale-toggle-track theme-toggle-track relative flex items-center gap-1 rounded-2xl p-1"
        title={t("topbar.language")}
        role="group"
        aria-label={t("topbar.language")}
      >
        <span
          className={`locale-toggle-pill ${locale === "ar" ? "locale-toggle-pill--ar" : "locale-toggle-pill--en"}`}
          aria-hidden="true"
        />
        {localeCodes.map((code) => (
          <button
            key={code}
            type="button"
            disabled={controlsLocked}
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            className={`locale-toggle-btn relative z-[1] min-w-[4.5rem] rounded-xl px-2.5 py-1.5 text-[11px] font-bold tracking-wide transition-colors duration-300 ${
              locale === code ? "text-white" : "theme-toggle-idle"
            } ${controlsLocked ? "pointer-events-none opacity-90" : ""}`}
          >
            {locales[code].label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeControls;
