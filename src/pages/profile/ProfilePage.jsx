import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import authApi from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import Avatar from "../../components/common/Avatar";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { resolveMediaUrl } from "../../utils/mediaUrl";

function ProfilePage() {
  const { t } = useTranslation();
  const { admin, reloadProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [fullName, setFullName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(admin?.fullName || "");
    setPreviewUrl(resolveMediaUrl(admin?.profileImage));
    setSelectedFile(null);
    setRemoveImage(false);
  }, [admin]);

  function onPickFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("pages.profile.invalidImage"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("pages.profile.imageTooLarge"));
      return;
    }
    setSelectedFile(file);
    setRemoveImage(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearAvatar() {
    setSelectedFile(null);
    setRemoveImage(true);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      if (fullName.trim() && fullName.trim() !== admin?.fullName) {
        formData.append("fullName", fullName.trim());
      }
      if (selectedFile) {
        formData.append("profileImageFile", selectedFile);
      }
      if (removeImage) {
        formData.append("removeProfileImage", "true");
      }
      if ([...formData.keys()].length === 0) {
        toast.error(t("pages.profile.noChanges"));
        setSaving(false);
        return;
      }

      await authApi.updateProfile(formData);
      await reloadProfile();
      toast.success(t("pages.profile.saved"));
      setSelectedFile(null);
      setRemoveImage(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!admin) {
    return <LoadingSpinner />;
  }

  return (
    <section className="mx-auto max-w-2xl">
      <PageHeader title={t("pages.profile.title")} subtitle={t("pages.profile.subtitle")} />

      <form onSubmit={saveProfile} className="rounded-2xl border border-default bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <button
            type="button"
            className="group relative"
            onClick={() => fileInputRef.current?.click()}
            aria-label={t("pages.profile.uploadAvatar")}
          >
            <Avatar name={fullName || admin.fullName} image={previewUrl || admin.profileImage} size="xl" showUploadHint />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onPickFile}
          />
          <div className="flex flex-col gap-2 text-center sm:text-start">
            <p className="text-sm font-semibold text-primary">{t("pages.profile.avatarHint")}</p>
            <p className="text-xs text-muted">{t("pages.profile.avatarFormats")}</p>
            <div className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                {t("pages.profile.uploadAvatar")}
              </Button>
              {(previewUrl || admin.profileImage) && !removeImage ? (
                <Button type="button" variant="ghost" size="sm" onClick={clearAvatar}>
                  {t("pages.profile.removeAvatar")}
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <FormInput
            label={t("tables.fullName")}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
          <FormInput label={t("tables.email")} value={admin.email} disabled />
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ProfilePage;
