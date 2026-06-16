import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import productsApi from "../../api/productsApi";
import useTranslation from "../../hooks/useTranslation";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/common/Button";
import TableActions, { TableActionButton } from "../../components/tables/TableActions";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";
import FormInput from "../../components/forms/FormInput";
import Modal from "../../components/modals/Modal";
import ModalForm from "../../components/modals/ModalForm";
import TextArea from "../../components/forms/TextArea";
import { formatDateTime } from "../../utils/formatDate";

function ProductDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageModal, setImageModal] = useState(false);
  const [benefitModal, setBenefitModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [benefit, setBenefit] = useState({ title: "", description: "", sortOrder: 0 });
  const [editingBenefitId, setEditingBenefitId] = useState(null);
  const [infoRowsText, setInfoRowsText] = useState("[]");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await productsApi.getById(id);
      const payload = response.data.data;
      setData(payload);
      setInfoRowsText(JSON.stringify(payload.infoItems || [], null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleAddImage(event) {
    event.preventDefault();
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("isPrimary", "false");
        await productsApi.addImage(id, formData, true);
      } else {
        await productsApi.addImage(id, { imageUrl, isPrimary: false, sortOrder: 0 });
      }
      toast.success(t("pages.productDetails.imageAdded"));
      setImageModal(false);
      setImageFile(null);
      setImageUrl("");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeImage(imageId) {
    if (!window.confirm(t("common.deleteConfirm", { name: t("pages.productDetails.images") }))) return;
    try {
      await productsApi.removeImage(id, imageId);
      toast.success(t("pages.productDetails.imageRemoved"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function saveBenefit(event) {
    event.preventDefault();
    try {
      if (editingBenefitId) {
        await productsApi.updateBenefit(id, editingBenefitId, {
          ...benefit,
          sortOrder: Number(benefit.sortOrder || 0)
        });
      } else {
        await productsApi.addBenefit(id, {
          ...benefit,
          sortOrder: Number(benefit.sortOrder || 0)
        });
      }
      toast.success(t("pages.productDetails.benefitSaved"));
      setBenefitModal(false);
      setEditingBenefitId(null);
      setBenefit({ title: "", description: "", sortOrder: 0 });
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeBenefit(benefitId) {
    if (!window.confirm(t("common.deleteConfirm", { name: t("pages.productDetails.benefits") }))) return;
    try {
      await productsApi.removeBenefit(id, benefitId);
      toast.success(t("pages.productDetails.benefitRemoved"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function saveInfoRows() {
    try {
      const infoItems = JSON.parse(infoRowsText);
      await productsApi.update(id, { infoItems });
      toast.success(t("pages.productDetails.infoUpdated"));
      load();
    } catch (err) {
      toast.error(t("pages.productDetails.invalidJson"));
    }
  }

  return (
    <section>
      <PageHeader title={t("pages.productDetails.title")} subtitle={t("pages.productDetails.subtitle")} />
      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && data ? (
        <Stagger className="detail-page space-y-5" stagger={0.08}>
          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <h3 className="text-lg font-bold text-primary">{data.name}</h3>
              {data.shortDescription ? (
                <p className="mt-2 text-sm text-muted">{data.shortDescription}</p>
              ) : null}
              <p className="mt-3 text-sm text-muted">
                {t("tables.date")}: <span className="text-primary">{formatDateTime(data.updatedAt)}</span>
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <div className="detail-section-header">
                <h4 className="detail-section-title">{t("pages.productDetails.images")}</h4>
                <Button onClick={() => setImageModal(true)}>{t("pages.productDetails.addImage")}</Button>
              </div>
              {(data.images || []).length ? (
                <div className="grid gap-3 md:grid-cols-3">
                  {(data.images || []).map((image) => (
                    <div key={image.id} className="detail-item-card overflow-hidden">
                      <img src={image.imageUrl} alt={data.name} className="h-32 w-full object-cover" />
                      <div className="flex justify-end border-t border-default p-2">
                        <TableActionButton icon="trash" variant="danger" onClick={() => removeImage(image.id)}>
                          {t("common.delete")}
                        </TableActionButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="detail-empty">{t("pages.productDetails.noImages")}</p>
              )}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <div className="detail-section-header">
                <h4 className="detail-section-title">{t("pages.productDetails.benefits")}</h4>
                <Button
                  onClick={() => {
                    setEditingBenefitId(null);
                    setBenefit({ title: "", description: "", sortOrder: 0 });
                    setBenefitModal(true);
                  }}
                >
                  {t("common.addNew")}
                </Button>
              </div>
              {(data.benefits || []).length ? (
                <div className="space-y-2">
                  {(data.benefits || []).map((item) => (
                    <div
                      key={item.id}
                      className="detail-item-card flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-primary">{item.title}</p>
                        {item.description ? (
                          <p className="mt-1 text-sm text-muted">{item.description}</p>
                        ) : null}
                      </div>
                      <TableActions>
                        <TableActionButton
                          icon="pencil"
                          onClick={() => {
                            setEditingBenefitId(item.id);
                            setBenefit({
                              title: item.title,
                              description: item.description,
                              sortOrder: item.sortOrder
                            });
                            setBenefitModal(true);
                          }}
                        >
                          {t("common.edit")}
                        </TableActionButton>
                        <TableActionButton icon="trash" variant="danger" onClick={() => removeBenefit(item.id)}>
                          {t("common.delete")}
                        </TableActionButton>
                      </TableActions>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="detail-empty">{t("pages.productDetails.noBenefits")}</p>
              )}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="detail-card card-surface p-5 sm:p-6">
              <h4 className="detail-section-title">{t("pages.productDetails.infoJson")}</h4>
              <TextArea
                className="mt-3"
                value={infoRowsText}
                onChange={(event) => setInfoRowsText(event.target.value)}
                rows={8}
              />
              <div className="mt-3 flex justify-end">
                <Button onClick={saveInfoRows}>{t("common.save")}</Button>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      ) : null}

      <Modal isOpen={imageModal} title={t("pages.productDetails.addImage")} onClose={() => setImageModal(false)}>
        <ModalForm
          onSubmit={handleAddImage}
          onCancel={() => setImageModal(false)}
          submitLabel={t("common.addNew")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("pages.productDetails.imageUrl")}
            className="md:col-span-2"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
          <FormInput
            type="file"
            label={t("pages.productDetails.addImage")}
            className="md:col-span-2"
            onChange={(event) => setImageFile(event.target.files?.[0])}
          />
        </ModalForm>
      </Modal>

      <Modal isOpen={benefitModal} title={t("pages.productDetails.benefitModal")} onClose={() => setBenefitModal(false)}>
        <ModalForm
          onSubmit={saveBenefit}
          onCancel={() => setBenefitModal(false)}
          submitLabel={t("common.save")}
          cancelLabel={t("common.cancel")}
        >
          <FormInput
            label={t("pages.productDetails.benefitTitle")}
            value={benefit.title}
            onChange={(event) => setBenefit((prev) => ({ ...prev, title: event.target.value }))}
          />
          <FormInput
            type="number"
            value={benefit.sortOrder}
            onChange={(event) => setBenefit((prev) => ({ ...prev, sortOrder: event.target.value }))}
          />
          <TextArea
            label={t("pages.productDetails.benefitDescription")}
            className="md:col-span-2"
            value={benefit.description}
            onChange={(event) => setBenefit((prev) => ({ ...prev, description: event.target.value }))}
          />
        </ModalForm>
      </Modal>
    </section>
  );
}

export default ProductDetailsPage;
