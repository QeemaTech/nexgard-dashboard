import Modal from "./Modal";
import Button from "../common/Button";
import { ModalFooter } from "./ModalForm";
import useTranslation from "../../hooks/useTranslation";

function ConfirmDialog({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel
}) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      title={title || t("dialogs.confirmAction")}
      onClose={onCancel}
      size="sm"
      footer={
        <ModalFooter>
          <Button variant="secondary" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel || t("common.confirm")}
          </Button>
        </ModalFooter>
      }
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {description || t("dialogs.confirmProceed")}
      </p>
    </Modal>
  );
}

export default ConfirmDialog;
