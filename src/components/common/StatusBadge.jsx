import { STATUS_COLORS } from "../../utils/constants";
import useTranslation from "../../hooks/useTranslation";
import { tStatus } from "../../utils/i18nHelpers";

function StatusBadge({ value }) {
  const { t } = useTranslation();
  const label = tStatus(t, value);
  const normalized = String(value || "UNKNOWN")
    .toUpperCase()
    .replace(/\s+/g, "_");
  const style =
    STATUS_COLORS[normalized] ||
    STATUS_COLORS[value] ||
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";

  return (
    <span className={`status-badge inline-flex items-center gap-1.5 ${style}`}>
      <span className="status-badge-dot" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default StatusBadge;
