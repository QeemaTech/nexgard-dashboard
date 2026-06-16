import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import settingsApi from "../../api/settingsApi";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import useTranslation from "../../hooks/useTranslation";

const initialForm = {
  appName: "",
  pointsExpiryDays: "",
  redeemCodeExpiryDays: "",
  maxScansPerDay: "",
  supportEmail: "",
  defaultLanguage: ""
};

function SettingsPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const response = await settingsApi.get();
        setForm({
          ...initialForm,
          ...response.data.data
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update({
        appName: form.appName,
        pointsExpiryDays: Number(form.pointsExpiryDays),
        redeemCodeExpiryDays: Number(form.redeemCodeExpiryDays),
        maxScansPerDay: Number(form.maxScansPerDay),
        supportEmail: form.supportEmail,
        defaultLanguage: form.defaultLanguage
      });
      toast.success(t("pages.settings.updated"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <PageHeader title={t("pages.settings.title")} subtitle={t("pages.settings.subtitle")} />
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error ? (
        <form className="grid max-w-3xl gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900" onSubmit={save}>
          <FormInput
            label={t("pages.settings.appName")}
            value={form.appName}
            onChange={(event) => setForm((prev) => ({ ...prev, appName: event.target.value }))}
          />
          <div className="grid gap-3 md:grid-cols-3">
            <FormInput
              label={t("pages.settings.pointsExpiryDays")}
              type="number"
              value={form.pointsExpiryDays}
              onChange={(event) => setForm((prev) => ({ ...prev, pointsExpiryDays: event.target.value }))}
            />
            <FormInput
              label={t("pages.settings.redeemCodeExpiryDays")}
              type="number"
              value={form.redeemCodeExpiryDays}
              onChange={(event) => setForm((prev) => ({ ...prev, redeemCodeExpiryDays: event.target.value }))}
            />
            <FormInput
              label={t("pages.settings.maxScansPerDay")}
              type="number"
              value={form.maxScansPerDay}
              onChange={(event) => setForm((prev) => ({ ...prev, maxScansPerDay: event.target.value }))}
            />
          </div>
          <FormInput
            label={t("pages.settings.supportEmail")}
            type="email"
            value={form.supportEmail}
            onChange={(event) => setForm((prev) => ({ ...prev, supportEmail: event.target.value }))}
          />
          <FormInput
            label={t("pages.settings.defaultLanguage")}
            value={form.defaultLanguage}
            onChange={(event) => setForm((prev) => ({ ...prev, defaultLanguage: event.target.value }))}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? t("common.saving") : t("pages.settings.saveSettings")}
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

export default SettingsPage;
