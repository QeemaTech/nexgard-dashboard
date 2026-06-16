import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import qrcodesApi from "../../api/qrcodesApi";
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
import { qrStatusSelectOptions } from "../../utils/i18nHelpers";
import { formatDateTime } from "../../utils/formatDate";

const initialGenerate = {
  productId: "",
  quantity: 1,
  batchCode: "",
  pointsValue: "",
  expiresAt: ""
};

function QRCodesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openGenerate, setOpenGenerate] = useState(false);
  const [generateForm, setGenerateForm] = useState(initialGenerate);
  const debouncedSearch = useDebounce(search);

  const loadProducts = useCallback(async () => {
    try {
      const response = await productsApi.list({ page: 1, limit: 200 });
      setProducts(response.data.data || []);
    } catch (err) {
      // ignore product dropdown failure in list context
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await qrcodesApi.list({
        ...params,
        search: debouncedSearch || undefined,
        status: status || undefined,
        productId: productId || undefined
      });
      setRows(response.data.data || []);
      setMeta(response.data.pagination || response.data.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params, debouncedSearch, status, productId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitGenerate(event) {
    event.preventDefault();
    try {
      const payload = {
        ...generateForm,
        quantity: Number(generateForm.quantity),
        pointsValue: generateForm.pointsValue === "" ? null : Number(generateForm.pointsValue),
        expiresAt: generateForm.expiresAt || null
      };
      await qrcodesApi.generate(payload);
      toast.success(t("pages.qrcodes.generated"));
      setGenerateForm(initialGenerate);
      setOpenGenerate(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function exportExcel() {
    try {
      const response = await qrcodesApi.exportExcel({
        status: status || undefined,
        productId: productId || undefined
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcodes.xlsx";
      link.click();
      URL.revokeObjectURL(url);
      toast.success(t("pages.qrcodes.exported"));
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeQRCode(row) {
    if (!window.confirm(t("pages.qrcodes.deleteConfirm", { code: row.code }))) return;
    try {
      await qrcodesApi.remove(row.id);
      toast.success(t("pages.qrcodes.deleted"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = useMemo(
    () => [
      {
        key: "code",
        header: t("tables.code"),
        render: (row) => (
          <Link to={`/app/qrcodes/${row.id}`} className="font-medium text-blue-600 hover:underline">
            {row.code}
          </Link>
        )
      },
      { key: "product", header: t("tables.product"), render: (row) => row.product?.name || "-" },
      { key: "batchCode", header: t("tables.batch") },
      { key: "pointsValue", header: t("tables.points"), render: (row) => row.pointsValue ?? row.product?.pointValue ?? 0 },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      { key: "usedByUser", header: t("tables.usedBy"), render: (row) => row.usedByUser?.fullName || "-" },
      { key: "expiresAt", header: t("tables.expiry"), render: (row) => formatDateTime(row.expiresAt) },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <TableActions>
            <TableActionButton icon="eye" onClick={() => navigate(`/app/qrcodes/${row.id}`)}>
              {t("common.view")}
            </TableActionButton>
            <TableActionButton icon="trash" variant="danger" onClick={() => removeQRCode(row)}>
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
        title={t("pages.qrcodes.title")}
        subtitle={t("pages.qrcodes.subtitle")}
        actions={
          <>
            <Button variant="secondary" onClick={exportExcel}>
              {t("pages.qrcodes.exportExcel")}
            </Button>
            <Button onClick={() => setOpenGenerate(true)}>{t("pages.qrcodes.generateBtn")}</Button>
          </>
        }
      />
      <DataTableToolbar>
        <FormInput
          placeholder={t("pages.qrcodes.searchPlaceholder")}
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
          options={qrStatusSelectOptions(t)}
        />
        <SelectInput
          value={productId}
          onChange={(event) => {
            setProductId(event.target.value);
            setPage(1);
          }}
          options={[
            { label: t("filters.allProducts"), value: "" },
            ...products.map((item) => ({ label: item.name, value: item.id }))
          ]}
        />
      </DataTableToolbar>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      <Modal isOpen={openGenerate} title={t("pages.qrcodes.generateTitle")} onClose={() => setOpenGenerate(false)}>
        <ModalForm
          onSubmit={submitGenerate}
          onCancel={() => setOpenGenerate(false)}
          submitLabel={t("common.generate")}
          cancelLabel={t("common.cancel")}
        >
          <SelectInput
            label={t("tables.product")}
            value={generateForm.productId}
            onChange={(event) => setGenerateForm((prev) => ({ ...prev, productId: event.target.value }))}
            options={[
              { label: t("common.selectOption", { item: t("tables.product") }), value: "" },
              ...products.map((item) => ({ label: item.name, value: item.id }))
            ]}
          />
          <FormInput
            label={t("tables.quantity")}
            type="number"
            min={1}
            value={generateForm.quantity}
            onChange={(event) => setGenerateForm((prev) => ({ ...prev, quantity: event.target.value }))}
          />
          <FormInput
            label={t("tables.batchCode")}
            value={generateForm.batchCode}
            onChange={(event) => setGenerateForm((prev) => ({ ...prev, batchCode: event.target.value }))}
          />
          <FormInput
            label={t("tables.pointsValue")}
            type="number"
            value={generateForm.pointsValue}
            onChange={(event) => setGenerateForm((prev) => ({ ...prev, pointsValue: event.target.value }))}
          />
          <FormInput
            label={t("tables.expiryDate")}
            type="datetime-local"
            value={generateForm.expiresAt}
            onChange={(event) => setGenerateForm((prev) => ({ ...prev, expiresAt: event.target.value }))}
          />
        </ModalForm>
      </Modal>
    </section>
  );
}

export default QRCodesPage;
