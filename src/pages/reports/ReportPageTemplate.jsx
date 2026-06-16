import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import DataTable from "../../components/tables/DataTable";
import BarChartCard from "../../components/charts/BarChartCard";
import SelectInput from "../../components/forms/SelectInput";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import useTranslation from "../../hooks/useTranslation";
import { tStatus } from "../../utils/i18nHelpers";
import { downloadReportExcel } from "../../utils/exportReportExcel";

function normalizeRows(data = {}) {
  if (Array.isArray(data.byStatus)) {
    return data.byStatus.map((item) => ({
      metric: item.status,
      count: item._count?.status || 0,
      value: item._count?.status || 0
    }));
  }
  if (Array.isArray(data.byType)) {
    return data.byType.map((item) => ({
      metric: item.type,
      count: item._count?.type || 0,
      sumPoints: item._sum?.points || 0,
      value: item._sum?.points || 0
    }));
  }
  return [];
}

function ReportPageTemplate({ title, subtitle, fetcher, exportFileName = "report" }) {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    period: "30d",
    from: "",
    to: ""
  });

  async function load(currentFilters) {
    setLoading(true);
    setError("");
    try {
      const response = await fetcher({
        period: currentFilters.period || undefined,
        from: currentFilters.from || undefined,
        to: currentFilters.to || undefined
      });
      setData(response.data.data || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  const rows = useMemo(
    () =>
      normalizeRows(data).map((row) => ({
        ...row,
        metric: tStatus(t, row.metric)
      })),
    [data, t]
  );

  const columns = useMemo(() => {
    if (data.byType) {
      return [
        { key: "metric", header: t("tables.type") },
        { key: "count", header: t("tables.count") },
        { key: "sumPoints", header: t("tables.totalPoints") }
      ];
    }
    return [
      { key: "metric", header: t("tables.status") },
      { key: "count", header: t("tables.count") }
    ];
  }, [data, t]);

  async function exportExcel() {
    if (!rows.length) {
      toast.error(t("pages.reports.noData"));
      return;
    }

    setExporting(true);
    try {
      await downloadReportExcel({
        rows,
        columns,
        filename: `${exportFileName}-${new Date().toISOString().slice(0, 10)}.xlsx`,
        sheetName: title
      });
      toast.success(t("pages.reports.exported"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <section>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button variant="secondary" onClick={exportExcel} disabled={loading || exporting || !rows.length}>
            <Download className="h-4 w-4" />
            {exporting ? t("pages.reports.exporting") : t("pages.reports.exportExcel")}
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <SelectInput
          value={filters.period}
          onChange={(event) => setFilters((prev) => ({ ...prev, period: event.target.value }))}
          options={[
            { label: t("common.period7d"), value: "7d" },
            { label: t("common.period30d"), value: "30d" },
            { label: t("common.period90d"), value: "90d" }
          ]}
        />
        <FormInput
          type="datetime-local"
          value={filters.from}
          onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
        />
        <FormInput
          type="datetime-local"
          value={filters.to}
          onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
        />
        <div className="flex gap-2">
          <Button onClick={() => load(filters)}>{t("common.apply")}</Button>
          <Button
            variant="secondary"
            onClick={() => {
              const next = { period: "30d", from: "", to: "" };
              setFilters(next);
              load(next);
            }}
          >
            {t("common.reset")}
          </Button>
        </div>
      </div>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <DataTable rows={rows} columns={columns} />
          <BarChartCard
            title={t("common.distribution", { title })}
            data={rows}
            xKey="metric"
            yKey="value"
          />
        </div>
      ) : null}
    </section>
  );
}

export default ReportPageTemplate;
