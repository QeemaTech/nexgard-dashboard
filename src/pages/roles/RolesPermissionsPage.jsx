import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import rolesApi from "../../api/rolesApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import FormInput from "../../components/forms/FormInput";
import DataTable from "../../components/tables/DataTable";
import DataTableToolbar from "../../components/tables/DataTableToolbar";
import TableActions, { TableActionButton } from "../../components/tables/TableActions";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/modals/Modal";
import ModalForm, { ModalFooter } from "../../components/modals/ModalForm";
import TextArea from "../../components/forms/TextArea";

const roleFormInitial = {
  name: "",
  description: ""
};

function groupPermissions(permissions) {
  return permissions.reduce((acc, item) => {
    const group = item.module || "general";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

function RolesPermissionsPage() {
  const { t } = useTranslation();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [roleForm, setRoleForm] = useState(roleFormInitial);
  const [permissionsModal, setPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

  const loadPermissions = useCallback(async () => {
    try {
      const response = await rolesApi.listPermissions({ page: 1, limit: 500 });
      setPermissions(response.data.data || []);
    } catch (err) {
      // ignore temporary permission list fetch issues
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await rolesApi.listRoles({
        ...params,
        search: debouncedSearch || undefined
      });
      setRows(response.data.data || []);
      setMeta(response.data.pagination || response.data.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params, debouncedSearch]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setRoleForm(roleFormInitial);
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setRoleForm({
      name: row.name || "",
      description: row.description || ""
    });
    setModalOpen(true);
  }

  async function submitRole(event) {
    event.preventDefault();
    try {
      if (editing) {
        await rolesApi.updateRole(editing.id, roleForm);
        toast.success(t("pages.roles.updated"));
      } else {
        await rolesApi.createRole(roleForm);
        toast.success(t("pages.roles.created"));
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeRole(row) {
    if (!window.confirm(t("common.deleteConfirm", { name: row.name }))) return;
    try {
      await rolesApi.deleteRole(row.id);
      toast.success(t("common.deleted"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function openPermissions(role) {
    setSelectedRole(role);
    setSelectedPermissionIds(
      (role.rolePermissions || []).map((item) => item.permissionId || item.permission?.id).filter(Boolean)
    );
    setPermissionsModal(true);
  }

  async function savePermissions() {
    if (!selectedRole) return;
    try {
      await rolesApi.updateRolePermissions(selectedRole.id, { permissionIds: selectedPermissionIds });
      toast.success(t("pages.roles.permissionsUpdated"));
      setPermissionsModal(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const grouped = useMemo(() => groupPermissions(permissions), [permissions]);

  const columns = useMemo(
    () => [
      { key: "name", header: t("pages.roles.roleName") },
      { key: "description", header: t("tables.description") },
      { key: "count", header: t("tables.permissions"), render: (row) => row.rolePermissions?.length || 0 },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <TableActions>
            <TableActionButton icon="pencil" onClick={() => openEdit(row)}>
              {t("common.edit")}
            </TableActionButton>
            <TableActionButton onClick={() => openPermissions(row)}>
              {t("tables.permissions")}
            </TableActionButton>
            <TableActionButton icon="trash" variant="danger" onClick={() => removeRole(row)}>
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
        title={t("pages.roles.title")}
        subtitle={t("pages.roles.subtitle")}
        actions={<Button onClick={openCreate}>{t("pages.roles.createTitle")}</Button>}
      />
      <DataTableToolbar className="max-w-md">
        <FormInput
          placeholder={t("pages.roles.searchPlaceholder")}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </DataTableToolbar>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      <Modal isOpen={modalOpen} title={editing ? t("pages.roles.editTitle") : t("pages.roles.createTitle")} onClose={() => setModalOpen(false)}>
        <ModalForm
          onSubmit={submitRole}
          onCancel={() => setModalOpen(false)}
          submitLabel={editing ? t("common.save") : t("common.addNew")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("pages.roles.roleName")}
            value={roleForm.name}
            onChange={(event) => setRoleForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <TextArea
            label={t("tables.description")}
            className="md:col-span-2"
            value={roleForm.description}
            onChange={(event) => setRoleForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </ModalForm>
      </Modal>

      <Modal
        isOpen={permissionsModal}
        title={`${t("pages.roles.permissionsTitle")}${selectedRole ? ` - ${selectedRole.name}` : ""}`}
        onClose={() => setPermissionsModal(false)}
        size="xl"
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={() => setPermissionsModal(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={savePermissions}>{t("pages.roles.savePermissions")}</Button>
          </ModalFooter>
        }
      >
        <div className="space-y-4">
          {Object.entries(grouped).map(([module, items]) => (
            <div key={module} className="card-surface rounded-lg p-3">
              <h4 className="mb-2 text-sm font-semibold uppercase text-primary">{module}</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {items.map((permission) => (
                  <label key={permission.id} className="permission-check flex items-center gap-2.5 text-sm text-primary">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedPermissionIds.includes(permission.id)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedPermissionIds((prev) => [...prev, permission.id]);
                        } else {
                          setSelectedPermissionIds((prev) => prev.filter((id) => id !== permission.id));
                        }
                      }}
                    />
                    {permission.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </section>
  );
}

export default RolesPermissionsPage;
