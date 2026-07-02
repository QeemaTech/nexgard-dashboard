import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import redeemApi from "../../api/redeemApi";
import redemptionsApi from "../../api/redemptionsApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import TableActions, { TableActionButton } from "../../components/tables/TableActions";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import { redemptionStatusSelectOptions, tStatus } from "../../utils/i18nHelpers";
import { formatDateTime } from "../../utils/formatDate";

function RedemptionsPage() {
  const { t } = useTranslation();
  const { page, setPage, params } = usePagination();
  const [tab, setTab] = useState("codes");
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyModal, setVerifyModal] = useState(false);
  const [useModal, setUseModal] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const api = tab === "codes" ? redeemApi : redemptionsApi;
      const response = await api.list({
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
  }, [params, debouncedSearch, status, tab]);

  useEffect(() => {
    load();
  }, [load]);

  function openVerify(code = "") {
    setCodeInput(code);
    setVerifyResult(null);
    setVerifyModal(true);
  }

  function openUse(code = "") {
    setCodeInput(code);
    setClinicId("");
    setUseModal(true);
  }

  async function verifyCode(event) {
    event.preventDefault();
    const code = codeInput.trim();
    if (!code) {
      toast.error(t("tables.code"));
      return;
    }
    try {
      const response = await redeemApi.verify({ code });
      setVerifyResult(response.data.data);
      toast.success(t("pages.redemptions.verified"));
    } catch (err) {
      setVerifyResult(null);
      toast.error(err.message);
    }
  }

  async function markAsUsed(event) {
    event.preventDefault();
    const code = codeInput.trim();
    if (!code) {
      toast.error(t("tables.code"));
      return;
    }
    try {
      await redeemApi.useCode({ code, clinicId: clinicId.trim() || undefined });
      toast.success(t("pages.redemptions.markedUsed"));
      setUseModal(false);
      setCodeInput("");
      setClinicId("");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const codeColumns = useMemo(
    () => [
      { key: "code", header: t("tables.code") },
      { key: "reward", header: t("tables.reward"), render: (row) => row.reward?.title || "-" },
      {
        key: "user",
        header: t("tables.user"),
        render: (row) => row.redemption?.user?.fullName || row.redemption?.userId || "-"
      },
      { key: "clinic", header: t("tables.clinic"), render: (row) => row.clinic?.name || row.clinicId || "-" },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      { key: "expiresAt", header: t("tables.expiry"), render: (row) => formatDateTime(row.expiresAt) },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <TableActions>
            <TableActionButton onClick={() => openVerify(row.code)}>
              {t("pages.redemptions.verifyCode")}
            </TableActionButton>
            <TableActionButton onClick={() => openUse(row.code)}>
              {t("pages.redemptions.useCode")}
            </TableActionButton>
          </TableActions>
        )
      }
    ],
    [t]
  );

  const rewardColumns = useMemo(
    () => [
      { key: "user", header: t("tables.user"), render: (row) => row.user?.fullName || "-" },
      { key: "reward", header: t("tables.reward"), render: (row) => row.reward?.title || "-" },
      { key: "pointsSpent", header: t("tables.points"), render: (row) => row.pointsSpent ?? "-" },
      { key: "clinic", header: t("tables.clinic"), render: (row) => row.clinic?.name || "-" },
      {
        key: "code",
        header: t("tables.code"),
        render: (row) => row.redeemCode?.code || "-"
      },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      {
        key: "requestedAt",
        header: t("tables.date"),
        render: (row) => formatDateTime(row.requestedAt)
      }
    ],
    [t]
  );

  const columns = tab === "codes" ? codeColumns : rewardColumns;

  return (
    <section>
      <PageHeader
        title={t("pages.redemptions.title")}
        subtitle={tab === "codes" ? t("pages.redemptions.subtitle") : t("pages.redemptions.rewardSubtitle")}
        actions={
          tab === "codes" ? (
            <>
              <Button variant="secondary" onClick={() => openVerify()}>
                {t("pages.redemptions.verifyCode")}
              </Button>
              <Button onClick={() => openUse()}>{t("pages.redemptions.useCode")}</Button>
            </>
          ) : null
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={tab === "codes" ? "primary" : "secondary"} onClick={() => { setTab("codes"); setPage(1); }}>
          {t("pages.redemptions.tabCodes")}
        </Button>
        <Button variant={tab === "rewards" ? "primary" : "secondary"} onClick={() => { setTab("rewards"); setPage(1); }}>
          {t("pages.redemptions.tabRewards")}
        </Button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <FormInput
          placeholder={t("pages.redemptions.searchPlaceholder")}
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
          options={redemptionStatusSelectOptions(t)}
        />
      </div>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      <Modal isOpen={verifyModal} title={t("pages.redemptions.verifyTitle")} onClose={() => setVerifyModal(false)}>
        <ModalForm
          onSubmit={verifyCode}
          onCancel={() => setVerifyModal(false)}
          submitLabel={t("common.verify")}
          cancelLabel={t("common.close")}
        >
          <FormInput
            label={t("tables.code")}
            className="md:col-span-2"
            value={codeInput}
            required
            onChange={(event) => setCodeInput(event.target.value)}
          />
        </ModalForm>
        {verifyResult ? (
          <div className="mt-4 rounded border border-slate-200 p-3 text-sm">
            <p>
              <span className="font-medium">{t("tables.status")}:</span> {tStatus(t, verifyResult.status)}
            </p>
            <p>
              <span className="font-medium">{t("common.canUse")}:</span>{" "}
              {verifyResult.canUse ? t("common.yes") : t("common.no")}
            </p>
            <p>
              <span className="font-medium">{t("tables.reward")}:</span> {verifyResult.reward?.title || "-"}
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={useModal} title={t("pages.redemptions.useTitle")} onClose={() => setUseModal(false)}>
        <ModalForm
          onSubmit={markAsUsed}
          onCancel={() => setUseModal(false)}
          submitLabel={t("pages.redemptions.useCode")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("tables.code")}
            value={codeInput}
            required
            onChange={(event) => setCodeInput(event.target.value)}
          />
          <FormInput
            label={t("pages.redemptions.clinicIdOptional")}
            value={clinicId}
            onChange={(event) => setClinicId(event.target.value)}
          />
        </ModalForm>
      </Modal>
    </section>
  );
}

export default RedemptionsPage;
