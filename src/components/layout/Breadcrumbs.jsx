import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_ITEMS } from "../../utils/constants";
import useTranslation from "../../hooks/useTranslation";

function Breadcrumbs() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const parts = pathname.split("/").filter(Boolean);

  function segmentLabel(part, path) {
    const match = SIDEBAR_ITEMS.find((item) => item.path === path || path.startsWith(`${item.path}/`));
    if (match) return t(match.labelKey);
    if (part === "overview") return t("nav.overview");
    if (part.length > 20) return t("breadcrumbs.details");
    return part.replace(/-/g, " ");
  }

  return (
    <div className="text-xs text-slate-500 dark:text-slate-400">
      <Link to="/app/overview" className="hover:text-slate-700 dark:hover:text-slate-200">
        {t("breadcrumbs.home")}
      </Link>
      {parts.slice(1).map((part, index) => {
        const path = `/${parts.slice(0, index + 2).join("/")}`;
        return (
          <span key={path}>
            <span className="mx-1">/</span>
            <Link to={path} className="capitalize hover:text-slate-700 dark:hover:text-slate-200">
              {segmentLabel(part, path)}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;
