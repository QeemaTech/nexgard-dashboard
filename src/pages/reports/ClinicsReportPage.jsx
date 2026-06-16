import reportsApi from "../../api/reportsApi";
import ReportPageTemplate from "./ReportPageTemplate";
import useTranslation from "../../hooks/useTranslation";

function ClinicsReportPage() {
  const { t } = useTranslation();
  return (
    <ReportPageTemplate
      title={t("pages.reports.clinicsTitle")}
      subtitle={t("pages.reports.clinicsSubtitle")}
      fetcher={reportsApi.clinics}
    />
  );
}

export default ClinicsReportPage;
