import useTranslation from "../../hooks/useTranslation";
import qeemaLogo from "../../assets/qeema-logo.png";

const QEEMA_SITE = "https://www.qeematech.net/";

function DashboardFooter({ variant = "default", className = "" }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const isCompact = variant === "compact";
  const copyright = t("footer.copyright")
    .replace("{{year}}", year)
    .replace("{{app}}", t("app.name"));

  return (
    <footer
      className={`dashboard-footer ${isCompact ? "dashboard-footer--compact" : ""} ${className}`.trim()}
      role="contentinfo"
    >
      <div className="dashboard-footer__inner">
        <p className="dashboard-footer__copyright">{copyright}</p>

        <a
          href={QEEMA_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="dashboard-footer__brand"
          aria-label={`${t("footer.qeemaTech")} - ${t("footer.qeemaTechAr")}`}
        >
          <span className="dashboard-footer__brand-glow" aria-hidden="true" />
          <img src={qeemaLogo} alt="" className="dashboard-footer__brand-logo" draggable={false} />
          <span className="dashboard-footer__brand-text">{t("footer.qeemaTech")}</span>
        </a>

        {!isCompact ? (
          <p className="dashboard-footer__tagline">
            {t("footer.poweredBy")}{" "}
            <span className="dashboard-footer__tagline-accent">{t("footer.qeemaTechAr")}</span>
          </p>
        ) : (
          <p className="dashboard-footer__tagline dashboard-footer__tagline--compact">
            {t("footer.poweredBy")}{" "}
            <span className="dashboard-footer__tagline-accent">{t("footer.qeemaTechAr")}</span>
          </p>
        )}
      </div>
    </footer>
  );
}

export default DashboardFooter;
