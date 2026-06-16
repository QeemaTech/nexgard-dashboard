import { Link, useNavigate } from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";
import usePermissions from "../../hooks/usePermissions";
import useAuth from "../../hooks/useAuth";
import { getDefaultDashboardPath } from "../../utils/dashboardNavigation";

function UnauthorizedPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { permissions } = usePermissions();
  const dashboardPath = getDefaultDashboardPath(permissions);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mx-auto mt-20 max-w-lg rounded-lg border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/40">
      <h1 className="text-2xl font-semibold text-amber-800 dark:text-amber-200">{t("unauthorized.title")}</h1>
      <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">{t("unauthorized.description")}</p>
      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {dashboardPath !== "/unauthorized" ? (
          <Link
            to={dashboardPath}
            className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            {t("unauthorized.goDashboard")}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex rounded-xl border border-amber-300 px-4 py-2 text-sm font-bold text-amber-800 transition hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/40"
        >
          {t("sidebar.logout")}
        </button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
