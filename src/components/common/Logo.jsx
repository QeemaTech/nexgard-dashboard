import { Link } from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";
import useTheme from "../../hooks/useTheme";
import ShinyText from "../reactbits/ShinyText";
import brandLogo from "../../assets/nexgard-brand.svg";
import brandLogoOnDark from "../../assets/nexgard-brand-on-dark.svg";
import brandMark from "../../assets/nexgard-mark.svg";

function LogoSubtitle({ className = "", onDark = false }) {
  const { t } = useTranslation();
  return (
    <ShinyText
      text={t("app.subtitle")}
      speed={3}
      className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
        onDark ? "text-blue-200" : "text-[#06A6FE]"
      } ${className}`}
      color={onDark ? "#93c5fd" : "#06A6FE"}
      shineColor={onDark ? "#ffffff" : "#bae6fd"}
    />
  );
}

function Logo({ variant = "sidebar", collapsed = false, className = "" }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const logoClass = "h-auto w-full max-h-[54px] object-contain object-start";
  const sidebarLogo = isDark ? brandLogoOnDark : brandLogo;

  if (variant === "auth") {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <img
          src={brandLogoOnDark}
          alt={t("app.name")}
          className="auth-logo h-auto w-[200px] max-w-full object-contain"
          draggable={false}
        />
        <LogoSubtitle onDark />
      </div>
    );
  }

  if (collapsed) {
    return (
      <Link
        to="/app/overview"
        className={`inline-flex shrink-0 transition-opacity hover:opacity-90 ${className}`}
        aria-label={t("app.name")}
      >
        <img
          src={brandMark}
          alt={t("app.name")}
          className="logo-mark h-11 w-11 rounded-2xl p-2 object-contain ring-1 ring-blue-100 dark:ring-slate-700"
          draggable={false}
        />
      </Link>
    );
  }

  return (
    <Link
      to="/app/overview"
      className={`group block min-w-0 transition-opacity hover:opacity-90 ${className}`}
      aria-label={t("app.name")}
    >
      <img src={sidebarLogo} alt={t("app.name")} className={logoClass} draggable={false} />
      <div className="logo-subtitle-row mt-3 flex items-center gap-2">
        <span className="logo-subtitle-line h-px flex-1" />
        <LogoSubtitle className="shrink-0" />
      </div>
    </Link>
  );
}

export default Logo;
