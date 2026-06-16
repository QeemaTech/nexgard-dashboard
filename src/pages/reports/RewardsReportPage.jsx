import reportsApi from "../../api/reportsApi";
import ReportPageTemplate from "./ReportPageTemplate";
import useTranslation from "../../hooks/useTranslation";

function RewardsReportPage() {
  const { t } = useTranslation();
  return (
    <ReportPageTemplate
      title={t("pages.reports.rewardsTitle")}
      subtitle={t("pages.reports.rewardsSubtitle")}
      exportFileName="rewards-report"
      fetcher={reportsApi.rewards}
    />
  );
}

export default RewardsReportPage;
