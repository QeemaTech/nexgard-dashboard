import useTranslation from "../../hooks/useTranslation";
import { ShinyText } from "../reactbits";

function LoadingSpinner({ label }) {
  const { t } = useTranslation();
  const text = label || t("common.loading");
  return (
    <div className="card-surface flex items-center justify-center gap-3 p-12 text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-400" />
      <ShinyText text={text} speed={2.2} className="text-sm font-medium" />
    </div>
  );
}

export default LoadingSpinner;
