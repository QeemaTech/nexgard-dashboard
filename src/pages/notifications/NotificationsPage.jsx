import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import notificationsApi from "../../api/notificationsApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import TextArea from "../../components/forms/TextArea";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import { formNotificationTypeOptions, notificationTypeSelectOptions } from "../../utils/i18nHelpers";
import { formatDateTime } from "../../utils/formatDate";

const initialForm = {
  title: "",
  body: "",
  type: "GENERAL",
  userIds: "",
  city: "",
  sendToAll: true
};

function NotificationsPage() {
  const { t } = useTranslation();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await notificationsApi.list({
        ...params,
        search: debouncedSearch || undefined,
        type: type || undefined
      });
      setRows(response.data.data || []);
      setMeta(response.data.pagination || response.data.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params, debouncedSearch, type]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(event) {
    event.preventDefault();
    try {
      await notificationsApi.send({
        ...form,
        userIds: form.userIds
          ? form.userIds
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        sendToAll: Boolean(form.sendToAll)
      });
      toast.success(t("pages.notifications.sent"));
      setForm(initialForm);
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = useMemo(
    () => [
      { key: "title", header: t("tables.title") },
      { key: "type", header: t("tables.type"), render: (row) => <StatusBadge value={row.type} /> },
      { key: "body", header: t("tables.body") },
      { key: "user", header: t("tables.user"), render: (row) => row.user?.fullName || t("common.bulkAll") },
      { key: "createdAt", header: t("tables.sentAt"), render: (row) => formatDateTime(row.createdAt) }
    ],
    [t]
  );

  return (
    <section>
      <PageHeader
        title={t("pages.notifications.title")}
        subtitle={t("pages.notifications.subtitle")}
        actions={<Button onClick={() => setModalOpen(true)}>{t("pages.notifications.sendBtn")}</Button>}
      />
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <FormInput
          placeholder={t("pages.notifications.searchPlaceholder")}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <SelectInput
          value={type}
          onChange={(event) => {
            setType(event.target.value);
            setPage(1);
          }}
          options={notificationTypeSelectOptions(t)}
        />
      </div>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      <Modal isOpen={modalOpen} title={t("pages.notifications.sendTitle")} onClose={() => setModalOpen(false)}>
        <ModalForm
          onSubmit={submit}
          onCancel={() => setModalOpen(false)}
          submitLabel={t("pages.notifications.sendBtn")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("tables.title")}
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <TextArea
            label={t("pages.notifications.messageBody")}
            className="md:col-span-2"
            value={form.body}
            onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
          />
          <SelectInput
            label={t("tables.type")}
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            options={formNotificationTypeOptions(t)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <SelectInput
              label={t("tables.user")}
              value={String(form.sendToAll)}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, sendToAll: event.target.value === "true" }))
              }
              options={[
                { label: t("pages.notifications.targetAll"), value: "true" },
                { label: t("filters.targeted"), value: "false" }
              ]}
            />
            <FormInput
              label={t("tables.city")}
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
            />
          </div>
          {!form.sendToAll ? (
            <FormInput
              label={t("pages.notifications.targetUserId")}
              className="md:col-span-2"
              value={form.userIds}
              onChange={(event) => setForm((prev) => ({ ...prev, userIds: event.target.value }))}
            />
          ) : null}
        </ModalForm>
      </Modal>
    </section>
  );
}

export default NotificationsPage;
