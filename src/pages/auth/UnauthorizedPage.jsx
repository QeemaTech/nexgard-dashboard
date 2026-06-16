import { Link } from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";

function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mt-20 max-w-lg rounded-lg border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/40">
      <h1 className="text-2xl font-semibold text-amber-800 dark:text-amber-200">{t("unauthorized.title")}</h1>
      <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">{t("unauthorized.description")}</p>
      <Link
        to="/app/overview"
        className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
      >
        {t("unauthorized.goDashboard")}
      </Link>
    </div>
  );
}

export default UnauthorizedPage;
