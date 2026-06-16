import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import usersApi from "../../api/usersApi";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";

function UserDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("pets");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const response = await usersApi.getById(id);
        setData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const petsColumns = useMemo(
    () => [
      { key: "name", header: t("tables.petName") },
      { key: "type", header: t("tables.type") },
      { key: "gender", header: t("tables.gender") },
      { key: "age", header: t("tables.age") }
    ],
    [t]
  );

  const scansColumns = useMemo(
    () => [
      { key: "id", header: t("tables.id") },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      { key: "points", header: t("tables.points"), render: (row) => row.qrCode?.pointsValue ?? row.qrCode?.product?.pointValue ?? 0 },
      { key: "scannedAt", header: t("tables.date"), render: (row) => formatDateTime(row.scannedAt) }
    ],
    [t]
  );

  const pointsColumns = useMemo(
    () => [
      { key: "type", header: t("tables.type") },
      { key: "points", header: t("tables.points") },
      { key: "description", header: t("tables.description") },
      { key: "createdAt", header: t("tables.date"), render: (row) => formatDateTime(row.createdAt) }
    ],
    [t]
  );

  const redemptionsColumns = useMemo(
    () => [
      { key: "id", header: t("tables.id") },
      { key: "reward", header: t("tables.reward"), render: (row) => row.reward?.title || "-" },
      { key: "pointsSpent", header: t("tables.points") },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      { key: "requestedAt", header: t("tables.date"), render: (row) => formatDateTime(row.requestedAt) }
    ],
    [t]
  );

  const tabs = useMemo(
    () => [
      { id: "pets", label: `${t("pages.userDetails.pets")} (${data?.pets?.length || 0})` },
      { id: "scans", label: `${t("pages.userDetails.scans")} (${data?.scanTransactions?.length || 0})` },
      { id: "points", label: `${t("pages.userDetails.transactions")} (${data?.pointsTransactions?.length || 0})` },
      { id: "redemptions", label: `${t("pages.userDetails.redemptions")} (${data?.rewardRedemptions?.length || 0})` }
    ],
    [data, t]
  );

  return (
    <section>
      <PageHeader title={t("pages.userDetails.title")} subtitle={t("pages.userDetails.subtitle")} />
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && data ? (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">{t("tables.fullName")}</p>
              <p className="font-medium">{data.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("tables.email")}</p>
              <p className="font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("tables.status")}</p>
              <StatusBadge value={data.status} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("pages.userDetails.availablePoints")}</p>
              <p className="font-medium">{data.pointsWallet?.availablePoints ?? 0}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rounded-md px-3 py-1.5 text-sm ${
                  tab === item.id ? "bg-blue-600 text-white" : "bg-white text-slate-600"
                } border border-slate-200`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "pets" ? <DataTable rows={data.pets || []} columns={petsColumns} /> : null}
          {tab === "scans" ? <DataTable rows={data.scanTransactions || []} columns={scansColumns} /> : null}
          {tab === "points" ? <DataTable rows={data.pointsTransactions || []} columns={pointsColumns} /> : null}
          {tab === "redemptions" ? (
            <DataTable rows={data.rewardRedemptions || []} columns={redemptionsColumns} />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default UserDetailsPage;
