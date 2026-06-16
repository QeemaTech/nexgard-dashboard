import { ChevronLeft, ChevronRight } from "lucide-react";
import useTranslation from "../../hooks/useTranslation";

function PaginationControls({ meta, onPageChange }) {
  const { t, isRtl } = useTranslation();
  if (!meta) return null;
  const { page = 1, totalPages = 1 } = meta;
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="pagination-bar flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold text-muted">
        {t("pagination.pageOf", { page, total: totalPages })}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <PrevIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {t("pagination.previous")}
        </button>
        <span className="pagination-pill">{page}</span>
        <button
          type="button"
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t("pagination.next")}
          <NextIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
