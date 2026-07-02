import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import scansApi from "../../api/scansApi";
import useTranslation from "../../hooks/useTranslation";
import usePermissions from "../../hooks/usePermissions";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import TextArea from "../../components/forms/TextArea";
import { tStatus } from "../../utils/i18nHelpers";
import { formatDateTime } from "../../utils/formatDate";

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-900">{value ?? "-"}</span>
    </div>
  );
}

function ScanDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasAnyPermission } = usePermissions();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canReview = hasAnyPermission(["scans.view"]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await scansApi.getById(id);
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function approveScan() {
    if (!data) return;
    setSubmitting(true);
    try {
      await scansApi.review(data.id, { status: "APPROVED" });
      toast.success(t("pages.scans.approved"));
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function rejectScan(event) {
    event.preventDefault();
    if (!data) return;
    setSubmitting(true);
    try {
      await scansApi.review(data.id, { status: "REJECTED", rejectionReason });
      toast.success(t("pages.scans.rejected"));
      setRejectModal(false);
      setRejectionReason("");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const purchase = data?.purchaseDetail;

  return (
    <section>
      <PageHeader
        title={t("pages.scanDetails.title")}
        subtitle={t("pages.scanDetails.subtitle")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/app/scans">
              <Button variant="secondary">{t("pages.scans.backToList")}</Button>
            </Link>
            {canReview && data?.status === "PENDING" ? (
              <>
                <Button onClick={approveScan} disabled={submitting}>
                  {t("pages.scans.approve")}
                </Button>
                <Button variant="danger" onClick={() => setRejectModal(true)} disabled={submitting}>
                  {t("pages.scans.reject")}
                </Button>
              </>
            ) : null}
          </div>
        }
      />

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && data ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">{t("pages.scanDetails.scanInfo")}</h3>
              <StatusBadge value={data.status} />
            </div>
            <DetailRow label={t("tables.user")} value={data.user?.fullName} />
            <DetailRow label={t("tables.email")} value={data.user?.email} />
            <DetailRow label={t("tables.code")} value={data.qrCode?.code} />
            <DetailRow label={t("tables.product")} value={data.product?.name || data.qrCode?.product?.name} />
            <DetailRow label={t("tables.points")} value={data.earnedPoints ?? 0} />
            <DetailRow label={t("tables.status")} value={tStatus(t, data.status)} />
            <DetailRow label={t("tables.date")} value={formatDateTime(data.scannedAt)} />
            <DetailRow label={t("pages.scanDetails.reviewedAt")} value={formatDateTime(data.reviewedAt)} />
            <DetailRow label={t("pages.scanDetails.reviewer")} value={data.reviewerAdmin?.fullName} />
            <DetailRow label={t("pages.scanDetails.rejectionReason")} value={data.rejectionReason} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">{t("pages.scanDetails.purchaseInfo")}</h3>
            <DetailRow label={t("pages.scanDetails.sourceType")} value={purchase?.sourceType} />
            <DetailRow label={t("tables.clinic")} value={purchase?.clinicName || purchase?.clinic?.name} />
            <DetailRow label={t("tables.doctor")} value={purchase?.doctorName || purchase?.doctor?.name} />
            <DetailRow label={t("tables.store")} value={purchase?.storeName || purchase?.store?.name} />
            <DetailRow label={t("pages.scanDetails.pet")} value={purchase?.pet?.name} />
            <DetailRow label={t("pages.scanDetails.location")} value={purchase?.location} />
            <DetailRow label={t("pages.scanDetails.invoiceNumber")} value={purchase?.invoiceNumber} />
            <DetailRow label={t("pages.scanDetails.purchaseDate")} value={formatDateTime(purchase?.purchaseDate)} />
            <DetailRow label={t("pages.scanDetails.notes")} value={purchase?.notes} />
            {data.user?.id ? (
              <div className="mt-4">
                <Button variant="secondary" onClick={() => navigate(`/app/users/${data.user.id}`)}>
                  {t("pages.scanDetails.viewUser")}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <Modal isOpen={rejectModal} title={t("pages.scans.rejectTitle")} onClose={() => setRejectModal(false)}>
        <ModalForm
          onSubmit={rejectScan}
          onCancel={() => setRejectModal(false)}
          submitLabel={t("pages.scans.reject")}
          cancelLabel={t("common.cancel")}
        >
          <TextArea
            label={t("pages.scanDetails.rejectionReason")}
            className="md:col-span-2"
            value={rejectionReason}
            required
            onChange={(event) => setRejectionReason(event.target.value)}
          />
        </ModalForm>
      </Modal>
    </section>
  );
}

export default ScanDetailsPage;
