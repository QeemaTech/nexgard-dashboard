import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, PawPrint, ShoppingBag, Stethoscope, Ticket, Users } from "lucide-react";
import clinicsApi from "../../api/clinicsApi";
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

function ClinicDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("doctors");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await clinicsApi.getById(id);
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

  const doctorsColumns = useMemo(
    () => [
      {
        key: "name",
        header: t("tables.name"),
        render: (row) => <EntityLink to={`/app/doctors/${row.id}`} label={row.name} />
      },
      { key: "specialization", header: t("tables.specialization"), render: (row) => row.specialization || "-" },
      { key: "phone", header: t("tables.phone"), render: (row) => row.phone || "-" },
      { key: "email", header: t("tables.email"), render: (row) => row.email || "-" },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> }
    ],
    [t]
  );

  const storesColumns = useMemo(
    () => [
      {
        key: "name",
        header: t("tables.name"),
        render: (row) => <EntityLink to={`/app/stores/${row.id}`} label={row.name} />
      },
      { key: "city", header: t("tables.city"), render: (row) => row.city || "-" },
      { key: "phone", header: t("tables.phone"), render: (row) => row.phone || "-" },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> }
    ],
    [t]
  );

  const petsColumns = useMemo(
    () => [
      {
        key: "name",
        header: t("tables.petName"),
        render: (row) => <EntityLink to={`/app/pets/${row.id}`} label={row.name} />
      },
      { key: "type", header: t("tables.type"), render: (row) => tStatus(t, row.type) },
      {
        key: "user",
        header: t("tables.user"),
        render: (row) => <EntityLink to={`/app/users/${row.user?.id}`} label={row.user?.fullName} />
      },
      { key: "createdAt", header: t("tables.date"), render: (row) => formatDateTime(row.createdAt) }
    ],
    [t]
  );

  const purchasesColumns = useMemo(
    () => [
      {
        key: "user",
        header: t("tables.user"),
        render: (row) => <EntityLink to={`/app/users/${row.user?.id}`} label={row.user?.fullName} />
      },
      { key: "sourceType", header: t("pages.scanDetails.sourceType"), render: (row) => row.sourceType || "-" },
      {
        key: "doctor",
        header: t("tables.doctor"),
        render: (row) => <EntityLink to={`/app/doctors/${row.doctor?.id}`} label={row.doctor?.name} />
      },
      {
        key: "store",
        header: t("tables.store"),
        render: (row) => <EntityLink to={`/app/stores/${row.store?.id}`} label={row.store?.name} />
      },
      {
        key: "scan",
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

  const rewardsColumns = useMemo(
    () => [
      {
        key: "title",
        header: t("tables.reward"),
        render: (row) => row.reward?.title || "-"
      },
      { key: "requiredPoints", header: t("tables.requiredPoints"), render: (row) => row.reward?.requiredPoints ?? "-" },
      {
        key: "status",
        header: t("tables.status"),
        render: (row) => <StatusBadge value={row.reward?.status} />
      }
    ],
    [t]
  );

  const adminColumns = useMemo(
    () => [
      { key: "fullName", header: t("tables.fullName") },
      { key: "email", header: t("tables.email") },
      {
        key: "roles",
        header: t("tables.roles"),
        render: (row) => row.roles?.map((item) => item.role?.name).filter(Boolean).join(", ") || "-"
      },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      {
        key: "lastLoginAt",
        header: t("pages.facilityDetails.lastLogin"),
        render: (row) => formatDateTime(row.lastLoginAt)
      }
    ],
    [t]
  );

  const tabs = [
    { key: "doctors", label: t("pages.facilityDetails.doctors"), rows: data?.doctors, columns: doctorsColumns },
    { key: "stores", label: t("pages.facilityDetails.stores"), rows: data?.stores, columns: storesColumns },
    { key: "pets", label: t("pages.facilityDetails.pets"), rows: data?.pets, columns: petsColumns },
    {
      key: "purchases",
      label: t("pages.facilityDetails.purchases"),
      rows: data?.purchaseDetails,
      columns: purchasesColumns
    },
    {
      key: "rewards",
      label: t("pages.facilityDetails.rewards"),
      rows: data?.rewardClinics,
      columns: rewardsColumns
    },
    {
      key: "admins",
      label: t("pages.facilityDetails.adminUsers"),
      rows: data?.adminUsers,
      columns: adminColumns
    }
  ];

  const activeTab = tabs.find((item) => item.key === tab) || tabs[0];
  const coordinates =
    data?.latitude != null && data?.longitude != null ? `${data.latitude}, ${data.longitude}` : data?.location;

  return (
    <section>
      <PageHeader
        title={data?.name || t("pages.clinicDetails.title")}
        subtitle={t("pages.clinicDetails.subtitle")}
        actions={
          <Link to="/app/clinics">
            <Button variant="secondary">{t("pages.clinicDetails.backToList")}</Button>
          </Link>
        }
      />

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && data ? (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard title={t("pages.facilityDetails.doctors")} value={data.stats?.doctorsCount ?? 0} icon={Stethoscope} />
            <StatCard title={t("pages.facilityDetails.stores")} value={data.stats?.storesCount ?? 0} icon={ShoppingBag} />
            <StatCard title={t("pages.facilityDetails.pets")} value={data.stats?.petsCount ?? 0} icon={PawPrint} />
            <StatCard title={t("pages.facilityDetails.purchases")} value={data.stats?.purchasesCount ?? 0} icon={Ticket} />
            <StatCard title={t("pages.facilityDetails.redemptions")} value={data.stats?.redemptionsCount ?? 0} icon={Users} />
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
              <DetailRow label={t("pages.facilityDetails.country")} value={data.country} />
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">{t("pages.facilityDetails.systemInfo")}</h3>
              <DetailRow label={t("tables.id")} value={data.id} />
              <DetailRow label={t("pages.facilityDetails.coordinates")} value={coordinates} />
              <DetailRow label={t("tables.location")} value={data.location} />
              <DetailRow label={t("tables.status")} value={tStatus(t, data.status)} />
              <DetailRow label={t("pages.facilityDetails.createdAt")} value={formatDateTime(data.createdAt)} />
              <DetailRow label={t("pages.facilityDetails.updatedAt")} value={formatDateTime(data.updatedAt)} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-slate-800">{t("pages.facilityDetails.relatedData")}</h3>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {tabs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    tab === item.key ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  onClick={() => setTab(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <DataTable columns={activeTab.columns} rows={activeTab.rows || []} />
            {tab === "purchases" && data.purchaseDetails?.length ? (
              <p className="mt-3 text-xs text-slate-500">{t("pages.facilityDetails.recentLimit")}</p>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}

export default ClinicDetailsPage;
