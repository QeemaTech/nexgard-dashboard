import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import useTranslation from "../../hooks/useTranslation";
import { modalBackdrop, modalPanel, springSnappy } from "../../motion/presets";

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl"
};

function Modal({ isOpen, title, children, footer, onClose, size = "lg" }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose?.();
          }}
          initial={reduced ? false : modalBackdrop.initial}
          animate={modalBackdrop.animate}
          exit={modalBackdrop.exit}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`card-surface flex max-h-[min(90vh,900px)] w-full flex-col overflow-hidden rounded-2xl shadow-2xl ${SIZE_CLASSES[size] || SIZE_CLASSES.lg}`}
            onClick={(event) => event.stopPropagation()}
            initial={reduced ? false : modalPanel.initial}
            animate={modalPanel.animate}
            exit={reduced ? undefined : modalPanel.exit}
            transition={springSnappy}
          >
            <div className="panel-muted flex shrink-0 items-center justify-between border-b px-6 py-4">
              <h3 id="modal-title" className="display-font text-lg font-bold text-primary">
                {title}
              </h3>
              <button
                type="button"
                className="rounded-xl p-2 text-muted transition hover:bg-panel hover:text-primary"
                onClick={onClose}
                aria-label={t("common.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="modal-scroll min-h-0 flex-1 overflow-y-auto p-6">{children}</div>

            {footer ? (
              <div className="panel-muted shrink-0 border-t border-default px-6 py-4">{footer}</div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Modal;
