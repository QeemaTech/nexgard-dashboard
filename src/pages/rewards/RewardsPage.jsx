import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import rewardsApi from "../../api/rewardsApi";
import clinicsApi from "../../api/clinicsApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import TextArea from "../../components/forms/TextArea";
import FileUpload from "../../components/forms/FileUpload";
import DataTable from "../../components/tables/DataTable";
import DataTableToolbar from "../../components/tables/DataTableToolbar";
import TableActions, { TableActionButton } from "../../components/tables/TableActions";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/modals/Modal";
import ModalForm, { ModalFooter } from "../../components/modals/ModalForm";
import { formRewardStatusOptions, rewardStatusSelectOptions } from "../../utils/i18nHelpers";

const initialForm = {
  title: "",
  description: "",
  termsAndConditions: "",
  requiredPoints: 0,
  status: "ACTIVE",
  startsAt: "",
  endsAt: "",
  image: "",
  maxRedemptions: "",
  perUserLimit: ""
};

function RewardsPage() {
  const { t } = useTranslation();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [clinicModal, setClinicModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [clinicId, setClinicId] = useState("");
  const [clinics, setClinics] = useState([]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchClinics() {
      try {
        const response = await clinicsApi.list({ page: 1, limit: 300 });
        if (!cancelled) {
          setClinics(response.data.data || []);
        }
      } catch {
        // ignore clinic dropdown failure
      }
    }

    fetchClinics();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    async function fetchRewards() {
      setLoading(true);
      setError("");
      try {
        const response = await rewardsApi.list({
          page: params.page,
          limit: params.limit,
          search: debouncedSearch || undefined,
          status: status || undefined
        });
        if (cancelled || requestId !== requestIdRef.current) return;
        setRows(response.data.data || []);
        setMeta(response.data.pagination || response.data.meta || null);
      } catch (err) {
        if (cancelled || requestId !== requestIdRef.current) return;
        setError(err.message);
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }

    fetchRewards();
    return () => {
      cancelled = true;
    };
  }, [params.page, params.limit, debouncedSearch, status]);

  function openCreate() {
    setEditing(null);
    setForm(initialForm);
    setImageFile(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      ...initialForm,
      ...row,
      startsAt: row.startsAt ? row.startsAt.slice(0, 16) : "",
      endsAt: row.endsAt ? row.endsAt.slice(0, 16) : ""
    });
    setImageFile(null);
    setModalOpen(true);
  }

  async function reloadRewards() {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError("");
    try {
      const response = await rewardsApi.list({
        page: params.page,
        limit: params.limit,
        search: debouncedSearch || undefined,
        status: status || undefined
      });
      if (requestId !== requestIdRef.current) return;
      setRows(response.data.data || []);
      setMeta(response.data.pagination || response.data.meta || null);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        requiredPoints: Number(form.requiredPoints || 0),
        maxRedemptions: form.maxRedemptions === "" ? null : Number(form.maxRedemptions),
        perUserLimit: form.perUserLimit === "" ? null : Number(form.perUserLimit),
        startsAt: form.startsAt || null,
        endsAt: form.endsAt || null
      };
      if (imageFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== null && value !== undefined) formData.append(key, value);
        });
        formData.append("imageFile", imageFile);
        if (editing) await rewardsApi.update(editing.id, formData, true);
        else await rewardsApi.create(formData, true);
      } else if (editing) {
        await rewardsApi.update(editing.id, payload);
      } else {
        await rewardsApi.create(payload);
      }
      toast.success(editing ? t("pages.rewards.updated") : t("pages.rewards.created"));
      setModalOpen(false);
      reloadRewards();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function remove(row) {
    if (!window.confirm(t("common.deleteConfirm", { name: row.title }))) return;
    try {
      await rewardsApi.remove(row.id);
      toast.success(t("pages.rewards.deleted"));
      reloadRewards();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function assignClinic() {
    if (!selectedReward || !clinicId) return;
    try {
      await rewardsApi.assignClinic(selectedReward.id, { clinicId });
      toast.success(t("pages.rewards.clinicAssigned"));
      setClinicModal(false);
      setClinicId("");
      reloadRewards();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeClinic(rewardId, currentClinicId) {
    try {
      await rewardsApi.removeClinic(rewardId, currentClinicId);
      toast.success(t("pages.rewards.clinicUnassigned"));
      reloadRewards();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = useMemo(
    () => [
      { key: "title", header: t("tables.title") },
      { key: "requiredPoints", header: t("tables.requiredPoints") },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      {
        key: "clinics",
        header: t("tables.assignedClinics"),
        render: (row) => row.rewardClinics?.length || 0
      },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <TableActions>
            <TableActionButton icon="pencil" onClick={() => openEdit(row)}>
              {t("common.edit")}
            </TableActionButton>
            <TableActionButton
              onClick={() => {
                setSelectedReward(row);
                setClinicModal(true);
              }}
            >
              {t("pages.rewards.assignClinic")}
            </TableActionButton>
            <TableActionButton icon="trash" variant="danger" onClick={() => remove(row)}>
              {t("common.delete")}
            </TableActionButton>
          </TableActions>
        )
      }
    ],
    [t]
  );

  return (
    <section>
      <PageHeader
        title={t("pages.rewards.title")}
        subtitle={t("pages.rewards.subtitle")}
        actions={<Button onClick={openCreate}>{t("pages.rewards.createTitle")}</Button>}
      />
      <DataTableToolbar>
        <FormInput
          placeholder={t("pages.rewards.searchPlaceholder")}
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
          options={rewardStatusSelectOptions(t)}
        />
      </DataTableToolbar>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      {!loading && !error ? (
        <div className="card-surface mt-4 p-5">
          <h4 className="display-font mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            {t("tables.assignedClinics")}
          </h4>
          <div className="space-y-2">
            {rows.some((reward) => reward.rewardClinics?.length) ? (
              rows.flatMap((reward) =>
                (reward.rewardClinics || []).map((entry) => (
                  <div
                    key={`${reward.id}-${entry.clinicId}`}
                    className="panel-muted flex items-center justify-between gap-3 rounded-xl border p-3"
                  >
                    <p className="min-w-0 text-sm text-primary">
                      <span className="font-semibold">{reward.title}</span>
                      <span className="text-muted"> · {entry.clinic?.name || entry.clinicId}</span>
                    </p>
                    <Button variant="danger" onClick={() => removeClinic(reward.id, entry.clinicId)}>
                      {t("pages.rewards.unassign")}
                    </Button>
                  </div>
                ))
              )
            ) : (
              <p className="text-sm text-muted">{t("common.noData")}</p>
            )}
          </div>
        </div>
      ) : null}

      <Modal
        isOpen={modalOpen}
        title={editing ? t("pages.rewards.editTitle") : t("pages.rewards.createTitle")}
        onClose={() => setModalOpen(false)}
      >
        <ModalForm
          onSubmit={submit}
          onCancel={() => setModalOpen(false)}
          submitLabel={editing ? t("common.save") : t("common.addNew")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("tables.title")}
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <FormInput
            label={t("tables.requiredPoints")}
            type="number"
            value={form.requiredPoints}
            onChange={(event) => setForm((prev) => ({ ...prev, requiredPoints: event.target.value }))}
          />
          <SelectInput
            label={t("tables.status")}
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            options={formRewardStatusOptions(t)}
          />
          <FormInput
            label={t("pages.rewards.imageUrl")}
            value={form.image}
            onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
          />
          <FileUpload label={t("pages.rewards.imageUrl")} onChange={(event) => setImageFile(event.target.files?.[0])} />
          <FormInput
            label={t("pages.rewards.startsAt")}
            type="datetime-local"
            value={form.startsAt}
            onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
          />
          <FormInput
            label={t("pages.rewards.endsAt")}
            type="datetime-local"
            value={form.endsAt}
            onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
          />
          <FormInput
            label={t("pages.rewards.maxRedemptions")}
            type="number"
            value={form.maxRedemptions}
            onChange={(event) => setForm((prev) => ({ ...prev, maxRedemptions: event.target.value }))}
          />
          <FormInput
            label={t("pages.rewards.perUserLimit")}
            type="number"
            value={form.perUserLimit}
            onChange={(event) => setForm((prev) => ({ ...prev, perUserLimit: event.target.value }))}
          />
          <TextArea
            label={t("tables.description")}
            className="md:col-span-2"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <TextArea
            label={t("pages.rewards.terms")}
            className="md:col-span-2"
            value={form.termsAndConditions}
            onChange={(event) => setForm((prev) => ({ ...prev, termsAndConditions: event.target.value }))}
          />
        </ModalForm>
      </Modal>

      <Modal
        isOpen={clinicModal}
        title={t("pages.rewards.assignClinicTitle", { title: selectedReward?.title || "" })}
        onClose={() => setClinicModal(false)}
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={() => setClinicModal(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={assignClinic}>{t("pages.rewards.assign")}</Button>
          </ModalFooter>
        }
      >
        <SelectInput
          label={t("tables.clinic")}
          value={clinicId}
          onChange={(event) => setClinicId(event.target.value)}
          options={[
            { label: t("pages.rewards.selectClinic"), value: "" },
            ...clinics.map((item) => ({ label: item.name, value: item.id }))
          ]}
        />
      </Modal>
    </section>
  );
}

export default RewardsPage;
