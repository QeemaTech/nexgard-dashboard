import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import usersApi from "../../api/usersApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import DataTable from "../../components/tables/DataTable";
import DataTableToolbar from "../../components/tables/DataTableToolbar";
import TableActions, { TableActionButton } from "../../components/tables/TableActions";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import { formStatusOptions, userStatusSelectOptions } from "../../utils/i18nHelpers";
import {
  downloadUsersExcelBlob,
  exportUsersExcelClient
} from "../../utils/exportUsersExcel";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  status: "ACTIVE"
};

function UsersListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [deleting, setDeleting] = useState(null);
  const [exporting, setExporting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await usersApi.list({
        ...params,
        search: debouncedSearch || undefined,
        status: status || undefined,
        city: city || undefined
      });
      setRows(response.data.data || []);
      setMeta(response.data.pagination || response.data.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params, debouncedSearch, status, city]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitEdit(event) {
    event.preventDefault();
    if (!editing) return;
    try {
      await usersApi.update(editing.id, form);
      toast.success(t("pages.users.updated"));
      setEditing(null);
      setForm(initialForm);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await usersApi.remove(deleting.id);
      toast.success(t("pages.users.deleted"));
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function exportExcel() {
    setExporting(true);
    const filters = {
      search: debouncedSearch || undefined,
      status: status || undefined,
      city: city || undefined
    };
    const filename = `users-${new Date().toISOString().slice(0, 10)}.xlsx`;

    try {
      const response = await usersApi.exportExcel(filters);
      downloadUsersExcelBlob(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
        filename
      );
      toast.success(t("pages.users.exported"));
    } catch {
      try {
        await exportUsersExcelClient(usersApi, filters);
        toast.success(t("pages.users.exported"));
      } catch (err) {
        toast.error(err.message);
      }
    } finally {
      setExporting(false);
    }
  }

  const columns = useMemo(
    () => [
      { key: "fullName", header: t("tables.fullName") },
      { key: "email", header: t("tables.email") },
      { key: "phone", header: t("tables.phone") },
      { key: "city", header: t("tables.city") },
      {
        key: "wallet",
        header: t("tables.wallet"),
        render: (row) => row.pointsWallet?.availablePoints ?? 0
      },
      {
        key: "status",
        header: t("tables.status"),
        render: (row) => <StatusBadge value={row.status} />
      },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <TableActions>
            <TableActionButton icon="eye" onClick={() => navigate(`/app/users/${row.id}`)}>
              {t("common.view")}
            </TableActionButton>
            <TableActionButton
              icon="pencil"
              onClick={() => {
                setEditing(row);
                setForm({
                  fullName: row.fullName || "",
                  email: row.email || "",
                  phone: row.phone || "",
                  city: row.city || "",
                  status: row.status || "ACTIVE"
                });
              }}
            >
              {t("common.edit")}
            </TableActionButton>
            <TableActionButton icon="trash" variant="danger" onClick={() => setDeleting(row)}>
              {t("common.delete")}
            </TableActionButton>
          </TableActions>
        )
      }
    ],
    [navigate, t]
  );

  return (
    <section>
      <PageHeader
        title={t("pages.users.title")}
        subtitle={t("pages.users.subtitle")}
        actions={
          <Button variant="secondary" onClick={exportExcel} disabled={exporting}>
            <Download className="h-4 w-4" />
            {exporting ? t("pages.users.exporting") : t("pages.users.exportExcel")}
          </Button>
        }
      />
      <DataTableToolbar>
        <FormInput
          placeholder={t("pages.users.searchPlaceholder")}
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
          options={userStatusSelectOptions(t)}
        />
        <FormInput
          placeholder={t("filters.filterByCity")}
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setPage(1);
          }}
        />
      </DataTableToolbar>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      <Modal isOpen={Boolean(editing)} title={t("pages.users.editTitle")} onClose={() => setEditing(null)}>
        <ModalForm
          onSubmit={submitEdit}
          onCancel={() => setEditing(null)}
          submitLabel={t("common.save")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("tables.fullName")}
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          />
          <FormInput
            label={t("tables.email")}
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <FormInput
            label={t("tables.phone")}
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          <FormInput
            label={t("tables.city")}
            value={form.city}
            onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
          />
          <SelectInput
            label={t("tables.status")}
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            options={formStatusOptions(t)}
          />
        </ModalForm>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        title={t("pages.users.deleteTitle")}
        description={t("common.deleteConfirm", { name: deleting?.fullName || t("pages.users.title") })}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default UsersListPage;
