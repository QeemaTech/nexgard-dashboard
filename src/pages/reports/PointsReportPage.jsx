import reportsApi from "../../api/reportsApi";
import ReportPageTemplate from "./ReportPageTemplate";
import useTranslation from "../../hooks/useTranslation";

function PointsReportPage() {
  const { t } = useTranslation();
  return (
    <ReportPageTemplate
      title={t("pages.reports.pointsTitle")}
      subtitle={t("pages.reports.pointsSubtitle")}
      fetcher={reportsApi.points}
    />
  );
}

export default PointsReportPage;
