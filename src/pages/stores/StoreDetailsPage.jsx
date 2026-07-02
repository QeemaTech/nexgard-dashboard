import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingBag, Ticket } from "lucide-react";
import storesApi from "../../api/storesApi";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/common/StatusBadge";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import { formatDateTime } from "../../utils/formatDate";
import { tStatus } from "../../utils/i18nHelpers";

function DetailRow({ label, value, children }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-900">{children ?? value ?? "-"}</span>
    </div>
  );
}

function EntityLink({ to, label }) {
  if (!to || !label) return "-";
  return (
    <Link to={to} className="detail-link font-medium">
      {label}
    </Link>
  );
}

function StoreDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await storesApi.getById(id);
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const purchasesColumns = useMemo(
    () => [
      {
        key: "user",
        header: t("tables.user"),
        render: (row) => <EntityLink to={`/app/users/${row.user?.id}`} label={row.user?.fullName} />
      },
      { key: "sourceType", header: t("pages.scanDetails.sourceType"), render: (row) => row.sourceType || "-" },
      {
        key: "pet",
        header: t("tables.petName"),
        render: (row) => <EntityLink to={`/app/pets/${row.pet?.id}`} label={row.pet?.name} />
      },
      {
        key: "doctor",
        header: t("tables.doctor"),
        render: (row) => <EntityLink to={`/app/doctors/${row.doctor?.id}`} label={row.doctor?.name} />
      },
      {
        key: "status",
        header: t("tables.status"),
        render: (row) => <StatusBadge value={row.scanTransaction?.status} />
      },
      {
        key: "createdAt",
        header: t("tables.date"),
        render: (row) => formatDateTime(row.scanTransaction?.scannedAt || row.createdAt)
      }
    ],
    [t]
  );

  return (
    <section>
      <PageHeader
        title={data?.name || t("pages.storeDetails.title")}
        subtitle={t("pages.storeDetails.subtitle")}
        actions={
          <Link to="/app/stores">
            <Button variant="secondary">{t("pages.storeDetails.backToList")}</Button>
          </Link>
        }
      />

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && data ? (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:max-w-sm">
            <StatCard title={t("pages.facilityDetails.purchases")} value={data.stats?.purchasesCount ?? 0} icon={Ticket} />
          </div>

          <div className="mb-6 grid gap-5 xl:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">{t("pages.facilityDetails.contactInfo")}</h3>
                <StatusBadge value={data.status} />
              </div>
              <DetailRow label={t("tables.name")} value={data.name} />
              <DetailRow label={t("tables.phone")} value={data.phone} />
              <DetailRow label={t("tables.email")} value={data.email} />
              <DetailRow label={t("tables.address")} value={data.address} />
              <DetailRow label={t("tables.city")} value={data.city} />
              <DetailRow label={t("tables.location")} value={data.location} />
              <DetailRow label={t("tables.clinic")}>
                <EntityLink to={`/app/clinics/${data.clinic?.id}`} label={data.clinic?.name} />
              </DetailRow>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">{t("pages.facilityDetails.systemInfo")}</h3>
              <DetailRow label={t("tables.id")} value={data.id} />
              <DetailRow label={t("tables.clinicId")} value={data.clinicId} />
              <DetailRow label={t("tables.status")} value={tStatus(t, data.status)} />
              <DetailRow label={t("pages.facilityDetails.createdAt")} value={formatDateTime(data.createdAt)} />
              <DetailRow label={t("pages.facilityDetails.updatedAt")} value={formatDateTime(data.updatedAt)} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-slate-800">{t("pages.facilityDetails.purchases")}</h3>
            </div>
            <DataTable columns={purchasesColumns} rows={data.purchaseDetails || []} />
            {data.purchaseDetails?.length ? (
              <p className="mt-3 text-xs text-slate-500">{t("pages.facilityDetails.recentLimit")}</p>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}

export default StoreDetailsPage;
