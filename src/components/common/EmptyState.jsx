import useTranslation from "../../hooks/useTranslation";
import { BlurText, ShinyText } from "../reactbits";

function EmptyState({ title, description }) {
  const { t } = useTranslation();
  return (
    <div className="card-surface rounded-2xl border-dashed p-12 text-center">
      <BlurText
        as="h3"
        text={title || t("common.noData")}
        className="display-font text-lg font-bold text-primary"
        delay={60}
        animateBy="words"
      />
      <p className="mt-2 text-sm text-muted">
        <ShinyText text={description || t("common.noDataHint")} speed={3.5} className="text-sm" />
      </p>
    </div>
  );
}

export default EmptyState;
