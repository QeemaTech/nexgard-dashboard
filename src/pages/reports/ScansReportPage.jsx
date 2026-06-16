import reportsApi from "../../api/reportsApi";
import ReportPageTemplate from "./ReportPageTemplate";
import useTranslation from "../../hooks/useTranslation";

function ScansReportPage() {
  const { t } = useTranslation();
  return (
    <ReportPageTemplate
      title={t("pages.reports.scansTitle")}
      subtitle={t("pages.reports.scansSubtitle")}
      exportFileName="scans-report"
      fetcher={reportsApi.scans}
    />
  );
}

export default ScansReportPage;
