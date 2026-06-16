import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, LogIn } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useTranslation from "../../hooks/useTranslation";
import useTheme from "../../hooks/useTheme";
import Button from "../../components/common/Button";
import ThemeControls from "../../components/layout/ThemeControls";
import DashboardFooter from "../../components/layout/DashboardFooter";
import brandLogo from "../../assets/nexgard-brand.svg";
import brandLogoOnDark from "../../assets/nexgard-brand-on-dark.svg";

function NotFoundPage({ embedded = false }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const homePath = isAuthenticated ? "/app/overview" : "/login";
  const logoSrc = isDark ? brandLogoOnDark : brandLogo;

  const content = (
    <div className={`not-found ${embedded ? "not-found--embedded" : "not-found--standalone"}`}>
      {!embedded ? (
        <div className="not-found__controls">
          <ThemeControls compact />
        </div>
      ) : null}

      <div className="not-found__card auth-form-enter">
        {!embedded ? (
          <div className="not-found__brand">
            <img src={logoSrc} alt={t("app.name")} className="not-found__logo" draggable={false} />
          </div>
        ) : null}

        <div className="not-found__code-wrap" aria-hidden="true">
          <span className="not-found__code-glow" />
          <span className="not-found__digit not-found__digit--4">4</span>
          <span className="not-found__mark">
            <img src={logoSrc} alt="" className="not-found__mark-img" draggable={false} />
          </span>
          <span className="not-found__digit not-found__digit--4b">4</span>
        </div>

        <h1 className="not-found__title display-font">{t("notFound.title")}</h1>
        <p className="not-found__description">{t("notFound.description")}</p>

        <div className="not-found__actions">
          <Button
            type="button"
            className="not-found__btn"
            onClick={() => navigate(homePath, { replace: true })}
          >
            {isAuthenticated ? <Home className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {isAuthenticated ? t("notFound.goDashboard") : t("notFound.goLogin")}
          </Button>
          <Button type="button" variant="secondary" className="not-found__btn" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            {t("notFound.goBack")}
          </Button>
        </div>

        {!embedded && !isAuthenticated ? (
          <p className="not-found__hint">
            {t("notFound.hint")}{" "}
            <Link to="/login" className="not-found__link">
              {t("auth.signIn")}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="not-found-shell min-h-screen bg-app transition-colors duration-300">
      {content}
      <DashboardFooter variant="compact" />
    </div>
  );
}

export default NotFoundPage;
