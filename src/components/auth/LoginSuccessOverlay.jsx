import { useEffect } from "react";
import useTranslation from "../../hooks/useTranslation";
import brandLogoOnDark from "../../assets/nexgard-brand-on-dark.svg";

function LoginSuccessOverlay({ onComplete, durationMs = 1500 }) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onComplete]);

  return (
    <div className="login-success-overlay" role="dialog" aria-modal="true" aria-label={t("auth.welcomeBack")}>
      <div className="login-success-overlay__backdrop" />
      <div className="login-success-overlay__content">
        <div className="login-success-overlay__stage">
          <span className="login-success-overlay__burst login-success-overlay__burst--one" aria-hidden="true" />
          <span className="login-success-overlay__burst login-success-overlay__burst--two" aria-hidden="true" />
          <span className="login-success-overlay__ring" aria-hidden="true" />
          <img
            src={brandLogoOnDark}
            alt={t("app.name")}
            className="login-success-overlay__logo"
            draggable={false}
          />
        </div>
        <p className="login-success-overlay__title">{t("auth.welcomeBack")}</p>
        <p className="login-success-overlay__subtitle">{t("auth.openingDashboard")}</p>
        <div className="login-success-overlay__track" aria-hidden="true">
          <span className="login-success-overlay__track-fill" />
        </div>
      </div>
    </div>
  );
}

export default LoginSuccessOverlay;
