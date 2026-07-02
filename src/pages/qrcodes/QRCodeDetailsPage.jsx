import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import qrcodesApi from "../../api/qrcodesApi";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
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

function QRCodeDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const qrRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const response = await qrcodesApi.getById(id);
        setData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function downloadQrImage() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas || !data?.code) {
      toast.error(t("common.error"));
      return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${data.code}.png`;
    link.click();
    toast.success(t("common.export"));
  }

  async function copyCode() {
    if (!data?.code) return;
    try {
      await navigator.clipboard.writeText(data.code);
    } catch {
      toast.error(t("common.error"));
    }
  }

  return (
    <section>
      <PageHeader
        title={t("pages.qrcodeDetails.title")}
        subtitle={t("pages.qrcodeDetails.subtitle")}
        actions={
          <Link to="/app/qrcodes">
            <Button variant="secondary">{t("nav.qrcodes")}</Button>
          </Link>
        }
      />

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && data ? (
        <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-center text-sm font-semibold text-slate-700">{t("pages.qrcodeDetails.title")}</h3>
            <div ref={qrRef} className="mx-auto flex justify-center rounded-lg border border-slate-100 bg-slate-50 p-6">
              <QRCodeCanvas
                value={data.code}
                size={240}
                level="M"
                includeMargin
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>
            <p className="mt-4 break-all text-center font-mono text-sm text-slate-700">{data.code}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={copyCode}>
                {t("tables.code")}
              </Button>
              <Button onClick={downloadQrImage}>{t("common.export")}</Button>
            </div></div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">{t("pages.qrcodeDetails.metadata")}</h3>
              <StatusBadge value={data.status} />
            </div>

            <DetailRow label={t("tables.code")} value={data.code} />
            <DetailRow label={t("tables.product")} value={data.product?.name} />
            <DetailRow label={t("pages.products.sku")} value={data.product?.sku} />
            <DetailRow label={t("tables.batchCode")} value={data.batchCode} />
            <DetailRow
              label={t("tables.pointsValue")}
              value={data.pointsValue ?? data.product?.pointValue ?? 0}
            />
            <DetailRow label={t("tables.status")} value={tStatus(t, data.status)} />
            <DetailRow label={t("tables.expiryDate")} value={formatDateTime(data.expiresAt)} />
            <DetailRow label={t("tables.sentAt")} value={formatDateTime(data.usedAt)} />
            <DetailRow
              label={t("tables.usedBy")}
              value={
                data.usedByUser
                  ? `${data.usedByUser.fullName} (${data.usedByUser.email})`
                  : "-"
              }
            />
            <DetailRow label={t("tables.date")} value={formatDateTime(data.createdAt)} />

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">{t("pages.qrcodeDetails.scanHistory")}</h3>
              {data.scanTransactions?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="py-2 pr-4">{t("tables.user")}</th>
                        <th className="py-2 pr-4">{t("tables.status")}</th>
                        <th className="py-2 pr-4">{t("tables.date")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.scanTransactions.map((scan) => (
                        <tr key={scan.id} className="border-b border-slate-100">
                          <td className="py-2 pr-4">{scan.user?.fullName || "-"}</td>
                          <td className="py-2 pr-4">
                            <StatusBadge value={scan.status} />
                          </td>
                          <td className="py-2 pr-4">{formatDateTime(scan.scannedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500">{t("pages.qrcodeDetails.noScanHistory")}</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default QRCodeDetailsPage;
