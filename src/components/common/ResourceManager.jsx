import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "../tables/DataTable";
import DataTableToolbar from "../tables/DataTableToolbar";
import TableActions, { TableActionButton } from "../tables/TableActions";
import Modal from "../modals/Modal";
import ConfirmDialog from "../modals/ConfirmDialog";
import ModalForm, { modalFieldClass } from "../modals/ModalForm";
import FormInput from "../forms/FormInput";
import SelectInput from "../forms/SelectInput";
import TextArea from "../forms/TextArea";
import Button from "./Button";
import PageHeader from "./PageHeader";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";
import useDebounce from "../../hooks/useDebounce";
import usePagination from "../../hooks/usePagination";
import StatusBadge from "./StatusBadge";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants";
import usePermissions from "../../hooks/usePermissions";
import useTranslation from "../../hooks/useTranslation";

function buildInitialForm(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? "";
    return acc;
  }, {});
}

function renderField(field, value, onChange) {
  const wrapperClass = modalFieldClass(field);

  if (field.type === "select") {
    return (
      <div key={field.name} className={wrapperClass}>
        <SelectInput
          label={field.label}
          value={value ?? ""}
          options={field.options || []}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <div key={field.name} className={wrapperClass}>
        <TextArea
          label={field.label}
          value={value ?? ""}
          rows={3}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      </div>
    );
  }
  return (
    <div key={field.name} className={wrapperClass}>
      <FormInput
        label={field.label}
        type={field.type || "text"}
        value={value ?? ""}
        onChange={(event) => onChange(field.name, event.target.value)}
      />
    </div>
  );
}

function ResourceManager({
  title,
  subtitle,
  listApi,
  createApi,
  updateApi,
  deleteApi,
  columns,
  formFields,
  searchPlaceholder = "Search...",
  permissionMap = {},
  disableCreate = false,
  getDetailPath,
  mapRowToForm,
  preparePayload
}) {
  const navigate = useNavigate();
  const { hasAnyPermission } = usePermissions();
  const { t } = useTranslation();
  const { page, setPage, params } = usePagination(1, DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [meta, setMeta] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(() => buildInitialForm(formFields));

  const canCreate = !disableCreate && (!permissionMap.create || hasAnyPermission(permissionMap.create));
  const canUpdate = !permissionMap.update || hasAnyPermission(permissionMap.update);
  const canDelete = !permissionMap.delete || hasAnyPermission(permissionMap.delete);

  const actionsColumn = useMemo(
    () => ({
      key: "actions",
      header: t("common.actions"),
      render: (row) => (
        <TableActions>
          {getDetailPath ? (
            <TableActionButton icon="eye" onClick={() => navigate(getDetailPath(row))}>
              {t("common.view")}
            </TableActionButton>
          ) : null}
          {canUpdate ? (
            <TableActionButton
              icon="pencil"
              onClick={() => {
                setEditingItem(row);
                setForm(mapRowToForm ? mapRowToForm(row) : buildInitialForm(formFields));
                setOpenModal(true);
              }}
            >
              {t("common.edit")}
            </TableActionButton>
          ) : null}
          {canDelete ? (
            <TableActionButton icon="trash" variant="danger" onClick={() => setDeleteItem(row)}>
              {t("common.delete")}
            </TableActionButton>
          ) : null}
        </TableActions>
      )
    }),
    [canDelete, canUpdate, formFields, getDetailPath, mapRowToForm, navigate, t]
  );

  const tableColumns = useMemo(() => {
    const normalized = columns.map((column) =>
      column.type === "status"
        ? {
            ...column,
            render: (row) => <StatusBadge value={row[column.key]} />
          }
        : column
    );
    if (canUpdate || canDelete || getDetailPath) {
      normalized.push(actionsColumn);
    }
    return normalized;
  }, [columns, actionsColumn, canDelete, canUpdate, getDetailPath]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listApi({
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
  }, [debouncedSearch, listApi, params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function resetModal() {
    setEditingItem(null);
    setForm(buildInitialForm(formFields));
    setOpenModal(false);
  }

  async function submitForm(event) {
    event.preventDefault();
    const payload = preparePayload ? preparePayload(form) : form;
    try {
      if (editingItem) {
        await updateApi(editingItem.id, payload);
        toast.success(t("common.updated"));
      } else {
        await createApi(payload);
        toast.success(t("common.created"));
      }
      resetModal();
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function confirmDelete() {
    if (!deleteItem) return;
    try {
      await deleteApi(deleteItem.id);
      toast.success(t("common.deleted"));
      setDeleteItem(null);
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <section>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          canCreate ? (
            <Button
              onClick={() => {
                setEditingItem(null);
                setForm(buildInitialForm(formFields));
                setOpenModal(true);
              }}
            >
              <Plus className="h-5 w-5" />
              {t("common.addNew")}
            </Button>
          ) : null
        }
      />

      <DataTableToolbar>
        <div className="relative w-full max-w-md">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={searchPlaceholder || t("common.search")}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="input-field py-2.5 ps-10"
          />
        </div>
      </DataTableToolbar>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable columns={tableColumns} rows={rows} meta={meta} onPageChange={setPage} /> : null}

      <Modal
        isOpen={openModal}
        title={
          editingItem
            ? t("common.editItem", { item: title })
            : t("common.createItem", { item: title })
        }
        onClose={resetModal}
      >
        <ModalForm
          onSubmit={submitForm}
          onCancel={resetModal}
          submitLabel={editingItem ? t("common.save") : t("common.addNew")}
          cancelLabel={t("common.cancel")}
        >
          {formFields.map((field) =>
            renderField(field, form[field.name], (name, value) => setForm((prev) => ({ ...prev, [name]: value })))
          )}
        </ModalForm>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteItem)}
        title={t("common.confirmDelete")}
        description={t("common.confirmDeleteHint")}
        onCancel={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        confirmLabel={t("common.confirm")}
      />
    </section>
  );
}

export default ResourceManager;
