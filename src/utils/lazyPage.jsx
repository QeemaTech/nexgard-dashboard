import { lazy } from "react";
import ErrorState from "../components/common/ErrorState";
import useTranslation from "../hooks/useTranslation";

function LazyPageLoadError({ labelKey }) {
  const { t } = useTranslation();
  return <ErrorState message={t("lazy.loadFailed", { label: t(labelKey) })} />;
}

export function lazyPage(importer, labelKey = "common.loadingPage") {
  return lazy(() =>
    importer().catch((error) => {
      console.error(`Failed to load page (${labelKey})`, error);
      return {
        default: function LazyPageLoadErrorWrapper() {
          return <LazyPageLoadError labelKey={labelKey} />;
        }
      };
    })
  );
}
