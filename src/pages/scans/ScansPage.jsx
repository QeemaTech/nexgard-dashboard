import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import scansApi from "../../api/scansApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import DataTable from "../../components/tables/DataTable";
import TableActions, { TableActionButton } from "../../components/tables/TableActions";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import { scanStatusSelectOptions } from "../../utils/i18nHelpers";
import { formatDateTime } from "../../utils/formatDate";

function ScansPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await scansApi.list({
        ...params,
        search: debouncedSearch || undefined,
        status: status || undefined
      });
      setRows(response.data.data || []);
      setMeta(response.data.pagination || response.data.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params, debouncedSearch, status]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(
    () => [
      {
        key: "user",
        header: t("tables.user"),
        render: (row) => row.user?.fullName || row.userId || "-"
      },
      {
        key: "qrCode",
        header: t("tables.code"),
        render: (row) => row.qrCode?.code || "-"
      },
      {
        key: "product",
        header: t("tables.product"),
        render: (row) => row.product?.name || row.qrCode?.product?.name || "-"
      },
      {
        key: "status",
        header: t("tables.status"),
        render: (row) => <StatusBadge value={row.status} />
      },
      {
        key: "earnedPoints",
        header: t("tables.points"),
        render: (row) => row.earnedPoints ?? 0
      },
      {
        key: "scannedAt",
        header: t("tables.date"),
        render: (row) => formatDateTime(row.scannedAt)
      },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <TableActions>
            <TableActionButton onClick={() => navigate(`/app/scans/${row.id}`)}>
              {t("common.view")}
            </TableActionButton>
          </TableActions>
        )
      }
    ],
    [navigate, t]
  );

  return (
    <section>
      <PageHeader title={t("pages.scans.title")} subtitle={t("pages.scans.subtitle")} />
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <FormInput
          placeholder={t("pages.scans.searchPlaceholder")}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <SelectInput
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          options={scanStatusSelectOptions(t)}
        />
      </div>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}
    </section>
  );
}

export default ScansPage;
