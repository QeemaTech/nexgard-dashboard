import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import useTranslation from "../../hooks/useTranslation";
import Button from "../common/Button";
import { springSnappy } from "../../motion/presets";

function RedemptionSuccessModal({ isOpen, onClose, data }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { user, reward, points } = data || {};
  const hasPoints = points && typeof points.before === "number" && typeof points.after === "number";

  return (
    <AnimatePresence>
      {isOpen && data ? (
        <motion.div
          className="modal-backdrop fixed inset-0 z-[110] flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose?.();
          }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="redemption-success-title"
            className="redemption-success-card"
            onClick={(event) => event.stopPropagation()}
            initial={reduced ? false : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={springSnappy}
          >
            <button
              type="button"
              className="redemption-success-card__close"
              onClick={onClose}
              aria-label={t("common.close")}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="redemption-success-card__badge">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2.2} />
            </div>

            <h3 id="redemption-success-title" className="redemption-success-card__title">
              {t("pages.redemptions.successTitle")}
            </h3>
            {reward?.title ? <p className="redemption-success-card__subtitle">{reward.title}</p> : null}
            {user?.fullName ? (
              <p className="redemption-success-card__user">
                {user.fullName}
                {user.email ? ` · ${user.email}` : ""}
              </p>
            ) : null}

            {hasPoints ? (
              <div className="redemption-success-card__points">
                <div className="redemption-success-card__points-col">
                  <span className="redemption-success-card__points-label">
                    {t("pages.redemptions.pointsBefore")}
                  </span>
                  <span className="redemption-success-card__points-value">
                    {points.before.toLocaleString()}
                  </span>
                </div>
                <div className="redemption-success-card__points-arrow">
                  {typeof points.spent === "number" ? (
                    <span className="redemption-success-card__points-chip">
                      -{points.spent.toLocaleString()}
                    </span>
                  ) : null}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="redemption-success-card__points-col redemption-success-card__points-col--after">
                  <span className="redemption-success-card__points-label">
                    {t("pages.redemptions.pointsAfter")}
                  </span>
                  <span className="redemption-success-card__points-value">
                    {points.after.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="redemption-success-card__no-points">{t("pages.redemptions.noPointsChange")}</p>
            )}

            <Button className="redemption-success-card__done" onClick={onClose}>
              {t("common.done")}
            </Button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default RedemptionSuccessModal;
