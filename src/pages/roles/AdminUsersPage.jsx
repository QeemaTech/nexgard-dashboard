import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import rolesApi from "../../api/rolesApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import DataTable from "../../components/tables/DataTable";
import DataTableToolbar from "../../components/tables/DataTableToolbar";
import TableActions, { TableActionButton } from "../../components/tables/TableActions";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import { formStatusOptions, userStatusSelectOptions } from "../../utils/i18nHelpers";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  status: "ACTIVE",
  clinicId: "",
  roleIds: ""
};

function AdminUsersPage() {
  const { t } = useTranslation();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadRoles = useCallback(async () => {
    try {
      const response = await rolesApi.listRoles({ page: 1, limit: 200 });
      setRoles(response.data.data || []);
    } catch (err) {
      // keep page usable even if roles fails temporarily
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await rolesApi.listAdminUsers({
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
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      fullName: row.fullName || "",
      email: row.email || "",
      password: "",
      status: row.status || "ACTIVE",
      clinicId: row.clinicId || "",
      roleIds: (row.roles || []).map((item) => item.roleId || item.role?.id).join(",")
    });
    setModalOpen(true);
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        roleIds: form.roleIds
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };
      if (!editing) {
        await rolesApi.createAdminUser(payload);
        toast.success(t("pages.adminUsers.created"));
      } else {
        if (!payload.password) delete payload.password;
        await rolesApi.updateAdminUser(editing.id, payload);
        toast.success(t("pages.adminUsers.updated"));
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function remove(row) {
    if (!window.confirm(t("common.deleteConfirm", { name: row.fullName }))) return;
    try {
      await rolesApi.deleteAdminUser(row.id);
      toast.success(t("pages.adminUsers.deleted"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = useMemo(
    () => [
      { key: "fullName", header: t("tables.fullName") },
      { key: "email", header: t("tables.email") },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      {
        key: "roles",
        header: t("tables.roles"),
        render: (row) =>
          (row.roles || [])
            .map((item) => item.role?.name)
            .filter(Boolean)
            .join(", ") || "-"
      },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <TableActions>
            <TableActionButton icon="pencil" onClick={() => openEdit(row)}>
              {t("common.edit")}
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
        title={t("pages.adminUsers.title")}
        subtitle={t("pages.adminUsers.subtitle")}
        actions={<Button onClick={openCreate}>{t("pages.adminUsers.createTitle")}</Button>}
      />
      <DataTableToolbar>
        <FormInput
          placeholder={t("pages.adminUsers.searchPlaceholder")}
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
      </DataTableToolbar>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      <Modal
        isOpen={modalOpen}
        title={editing ? t("pages.adminUsers.editTitle") : t("pages.adminUsers.createTitle")}
        onClose={() => setModalOpen(false)}
      >
        <ModalForm
          onSubmit={submit}
          onCancel={() => setModalOpen(false)}
          submitLabel={editing ? t("common.save") : t("common.addNew")}
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
            label={t("pages.adminUsers.password")}
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <SelectInput
            label={t("tables.status")}
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            options={formStatusOptions(t)}
          />
          <FormInput
            label={t("tables.clinicId")}
            value={form.clinicId}
            onChange={(event) => setForm((prev) => ({ ...prev, clinicId: event.target.value }))}
          />
          <SelectInput
            label={t("pages.adminUsers.roleIds")}
            className="md:col-span-2"
            value={form.roleIds}
            onChange={(event) => setForm((prev) => ({ ...prev, roleIds: event.target.value }))}
            options={[
              { label: t("pages.adminUsers.chooseRoles"), value: "" },
              ...roles.map((role) => ({ label: `${role.name} (${role.id})`, value: role.id }))
            ]}
          />
        </ModalForm>
      </Modal>
    </section>
  );
}

export default AdminUsersPage;
