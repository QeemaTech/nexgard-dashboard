import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import productsApi from "../../api/productsApi";
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
import TextArea from "../../components/forms/TextArea";
import { formStatusOptions, productStatusSelectOptions } from "../../utils/i18nHelpers";

const emptyForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  strength: "",
  suitableFor: "",
  packContains: "",
  activeIngredient: "",
  pointValue: 0,
  status: "ACTIVE",
  mainImage: "",
  images: [],
  benefits: [],
  infoItems: []
};

function ProductsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await productsApi.list({
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
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      ...emptyForm,
      ...row
    });
    setModalOpen(true);
  }

  async function submit(event) {
    event.preventDefault();
    try {
      if (editing) {
        await productsApi.update(editing.id, form);
        toast.success(t("pages.products.updated"));
      } else {
        await productsApi.create(form);
        toast.success(t("pages.products.created"));
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function remove(row) {
    if (!window.confirm(t("common.deleteConfirm", { name: row.name }))) return;
    try {
      await productsApi.remove(row.id);
      toast.success(t("pages.products.deleted"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = useMemo(
    () => [
      { key: "name", header: t("tables.name") },
      { key: "slug", header: t("tables.slug") },
      { key: "pointValue", header: t("tables.points") },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <TableActions>
            <TableActionButton icon="eye" onClick={() => navigate(`/app/products/${row.id}`)}>
              {t("common.view")}
            </TableActionButton>
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
    [navigate, t]
  );

  return (
    <section>
      <PageHeader
        title={t("pages.products.title")}
        subtitle={t("pages.products.subtitle")}
        actions={<Button onClick={openCreate}>{t("pages.products.createTitle")}</Button>}
      />
      <DataTableToolbar>
        <FormInput
          placeholder={t("pages.products.searchPlaceholder")}
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
          options={productStatusSelectOptions(t)}
        />
      </DataTableToolbar>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable columns={columns} rows={rows} meta={meta} onPageChange={setPage} /> : null}

      <Modal
        isOpen={modalOpen}
        title={editing ? t("pages.products.editTitle") : t("pages.products.createTitle")}
        onClose={() => setModalOpen(false)}
      >
        <ModalForm
          onSubmit={submit}
          onCancel={() => setModalOpen(false)}
          submitLabel={editing ? t("common.save") : t("common.addNew")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("tables.name")}
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <FormInput
            label={t("tables.slug")}
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
          />
          <FormInput
            label={t("pages.products.pointValue")}
            type="number"
            value={form.pointValue}
            onChange={(event) => setForm((prev) => ({ ...prev, pointValue: Number(event.target.value) }))}
          />
          <SelectInput
            label={t("tables.status")}
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            options={formStatusOptions(t, ["ACTIVE", "INACTIVE"])}
          />
          <FormInput
            label={t("pages.products.mainImage")}
            className="md:col-span-2"
            value={form.mainImage}
            onChange={(event) => setForm((prev) => ({ ...prev, mainImage: event.target.value }))}
          />
          <FormInput
            label={t("pages.products.strength")}
            value={form.strength}
            onChange={(event) => setForm((prev) => ({ ...prev, strength: event.target.value }))}
          />
          <FormInput
            label={t("pages.products.suitableFor")}
            value={form.suitableFor}
            onChange={(event) => setForm((prev) => ({ ...prev, suitableFor: event.target.value }))}
          />
          <FormInput
            label={t("pages.products.packContains")}
            value={form.packContains}
            onChange={(event) => setForm((prev) => ({ ...prev, packContains: event.target.value }))}
          />
          <FormInput
            label={t("pages.products.activeIngredient")}
            value={form.activeIngredient}
            onChange={(event) => setForm((prev) => ({ ...prev, activeIngredient: event.target.value }))}
          />
          <TextArea
            label={t("pages.products.shortDescription")}
            className="md:col-span-2"
            value={form.shortDescription}
            onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))}
          />
          <TextArea
            label={t("tables.description")}
            className="md:col-span-2"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </ModalForm>
      </Modal>
    </section>
  );
}

export default ProductsListPage;
