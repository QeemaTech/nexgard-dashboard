import useTranslation from "../../hooks/useTranslation";
import useTheme from "../../hooks/useTheme";
import brandLogo from "../../assets/nexgard-brand.svg";
import brandLogoOnDark from "../../assets/nexgard-brand-on-dark.svg";
import brandMark from "../../assets/nexgard-mark.svg";

function BrandLoader({ variant = "splash", label, showLabel = true, className = "" }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const text = label || t("common.loadingPage");
  const useFullLogo = variant === "splash" || variant === "success";
  const logoSrc = useFullLogo
    ? isDark
      ? brandLogoOnDark
      : brandLogo
    : brandMark;

  return (
    <div
      className={`brand-loader brand-loader--${variant} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="brand-loader__stage">
        <span className="brand-loader__ring brand-loader__ring--outer" aria-hidden="true" />
        <span className="brand-loader__ring brand-loader__ring--inner" aria-hidden="true" />
        <span className="brand-loader__orbit brand-loader__orbit--a" aria-hidden="true" />
        <span className="brand-loader__orbit brand-loader__orbit--b" aria-hidden="true" />
        <span className="brand-loader__glow" aria-hidden="true" />
        <img
          src={logoSrc}
          alt={t("app.name")}
          className={`brand-loader__logo ${useFullLogo ? "brand-loader__logo--full" : ""}`}
          draggable={false}
        />
      </div>

      {showLabel ? (
        <div className="brand-loader__copy">
          <p className="brand-loader__label">{text}</p>
          <div className="brand-loader__progress" aria-hidden="true">
            <span className="brand-loader__progress-bar" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BrandLoader;
