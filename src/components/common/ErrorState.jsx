import useTranslation from "../../hooks/useTranslation";

function ErrorState({ message }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
      {message || t("common.error")}
    </div>
  );
}

export default ErrorState;
