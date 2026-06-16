import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import pointsApi from "../../api/pointsApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import { pointsTypeSelectOptions } from "../../utils/i18nHelpers";
import { formatDateTime } from "../../utils/formatDate";

const initialAdjustForm = {
  userId: "",
  points: "",
  type: "ADJUSTMENT",
  reason: ""
};

function PointsPage() {
  const { t } = useTranslation();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [searchUserId, setSearchUserId] = useState("");
  const [type, setType] = useState("");
  const debouncedUserId = useDebounce(searchUserId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialAdjustForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await pointsApi.listTransactions({
        ...params,
        userId: debouncedUserId || undefined,
        type: type || undefined
      });
      setRows(response.data.data || []);
      setMeta(response.data.pagination || response.data.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params, debouncedUserId, type]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitAdjust(event) {
    event.preventDefault();
    try {
      await pointsApi.adjustPoints({
        ...form,
        points: Number(form.points)
      });
      toast.success(t("pages.points.adjusted"));
      setModalOpen(false);
      setForm(initialAdjustForm);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = useMemo(
    () => [
      { key: "user", header: t("tables.user"), render: (row) => row.user?.fullName || "-" },
      { key: "type", header: t("tables.type") },
      { key: "points", header: t("tables.points") },
      { key: "balanceBefore", header: t("tables.before") },
      { key: "balanceAfter", header: t("tables.after") },
      { key: "reason", header: t("tables.reason") },
      { key: "createdAt", header: t("tables.date"), render: (row) => formatDateTime(row.createdAt) }
    ],
    [t]
  );

  return (
    <section>
      <PageHeader
        title={t("pages.points.title")}
        subtitle={t("pages.points.subtitle")}
        actions={<Button onClick={() => setModalOpen(true)}>{t("pages.points.manualAdjust")}</Button>}
      />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <FormInput
          placeholder={t("pages.points.filterUserId")}
          value={searchUserId}
          onChange={(event) => {
            setSearchUserId(event.target.value);
            setPage(1);
          }}
        />
        <SelectInput
          value={type}
          onChange={(event) => {
            setType(event.target.value);
            setPage(1);
          }}
          options={pointsTypeSelectOptions(t)}
        />
      </div>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      <Modal isOpen={modalOpen} title={t("pages.points.adjustTitle")} onClose={() => setModalOpen(false)}>
        <ModalForm
          onSubmit={submitAdjust}
          onCancel={() => setModalOpen(false)}
          submitLabel={t("pages.points.submitAdjust")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("pages.points.userId")}
            value={form.userId}
            onChange={(event) => setForm((prev) => ({ ...prev, userId: event.target.value }))}
          />
          <FormInput
            label={t("pages.points.pointsDelta")}
            type="number"
            value={form.points}
            onChange={(event) => setForm((prev) => ({ ...prev, points: event.target.value }))}
          />
          <FormInput
            label={t("tables.reason")}
            value={form.reason}
            onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
          />
        </ModalForm>
      </Modal>
    </section>
  );
}

export default PointsPage;
