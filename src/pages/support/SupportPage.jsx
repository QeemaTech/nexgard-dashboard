import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import supportApi from "../../api/supportApi";
import usePagination from "../../hooks/usePagination";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import SelectInput from "../../components/forms/SelectInput";
import TextArea from "../../components/forms/TextArea";
import FileUpload from "../../components/forms/FileUpload";
import { formSupportStatusOptions, supportStatusSelectOptions } from "../../utils/i18nHelpers";
import { formatDateTime } from "../../utils/formatDate";

function SupportPage() {
  const { t } = useTranslation();
  const { page, setPage, params } = usePagination();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyAttachment, setReplyAttachment] = useState(null);
  const [newStatus, setNewStatus] = useState("OPEN");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await supportApi.listConversations({
        ...params,
        status: status || undefined
      });
      setRows(response.data.data || []);
      setMeta(response.data.pagination || response.data.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function openConversation(id) {
    try {
      const response = await supportApi.getConversation(id);
      setSelectedConversation(response.data.data);
      setNewStatus(response.data.data.status || "OPEN");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!selectedConversation) return;
    try {
      if (replyAttachment) {
        const formData = new FormData();
        formData.append("message", replyText);
        formData.append("attachmentFile", replyAttachment);
        await supportApi.reply(selectedConversation.id, formData, true);
      } else {
        await supportApi.reply(selectedConversation.id, { message: replyText, isInternal: false });
      }
      toast.success(t("pages.support.replySent"));
      setReplyText("");
      setReplyAttachment(null);
      openConversation(selectedConversation.id);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function updateStatus() {
    if (!selectedConversation) return;
    try {
      await supportApi.updateStatus(selectedConversation.id, { status: newStatus });
      toast.success(t("pages.support.statusUpdated"));
      openConversation(selectedConversation.id);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = useMemo(
    () => [
      { key: "id", header: t("tables.id") },
      { key: "user", header: t("tables.user"), render: (row) => row.user?.fullName || "-" },
      { key: "status", header: t("tables.status"), render: (row) => <StatusBadge value={row.status} /> },
      { key: "lastMessageAt", header: t("tables.lastMessage"), render: (row) => formatDateTime(row.lastMessageAt) },
      {
        key: "actions",
        header: t("common.actions"),
        render: (row) => (
          <Button variant="secondary" onClick={() => openConversation(row.id)}>
            {t("common.open")}
          </Button>
        )
      }
    ],
    [t]
  );

  return (
    <section>
      <PageHeader title={t("pages.support.title")} subtitle={t("pages.support.subtitle")} />
      <div className="mb-4 max-w-xs">
        <SelectInput
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          options={supportStatusSelectOptions(t)}
        />
      </div>
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? <DataTable rows={rows} columns={columns} meta={meta} onPageChange={setPage} /> : null}

      <Modal
        isOpen={Boolean(selectedConversation)}
        title={`${t("pages.support.conversation")} ${selectedConversation?.id || ""}`}
        onClose={() => setSelectedConversation(null)}
        size="lg"
      >
        {selectedConversation ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge value={selectedConversation.status} />
              <div className="flex flex-wrap items-center gap-2">
                <SelectInput
                  value={newStatus}
                  onChange={(event) => setNewStatus(event.target.value)}
                  options={formSupportStatusOptions(t)}
                />
                <Button onClick={updateStatus}>{t("pages.support.updateStatus")}</Button>
              </div>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded border border-slate-200 p-3">
              {(selectedConversation.messages || []).length ? (
                (selectedConversation.messages || []).map((message) => (
                  <div
                    key={message.id}
                    className={`rounded p-2 text-sm ${
                      message.adminUserId ? "bg-blue-50 text-blue-900" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <p>{message.message}</p>
                    {message.attachment ? (
                      <a
                        href={message.attachment}
                        className="mt-1 block text-xs text-blue-700 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("pages.support.attachment")}
                      </a>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">{t("pages.support.noConversation")}</p>
              )}
            </div>
            <ModalForm
              onSubmit={sendReply}
              onCancel={() => setSelectedConversation(null)}
              submitLabel={t("pages.support.sendReply")}
              cancelLabel={t("common.close")}
            >
              <TextArea
                label={t("pages.support.reply")}
                className="md:col-span-2"
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
              />
              <FileUpload
                label={t("pages.support.attachment")}
                className="md:col-span-2"
                onChange={(event) => setReplyAttachment(event.target.files?.[0])}
              />
            </ModalForm>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}

export default SupportPage;
