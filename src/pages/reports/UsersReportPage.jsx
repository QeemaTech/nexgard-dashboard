import reportsApi from "../../api/reportsApi";
import ReportPageTemplate from "./ReportPageTemplate";
import useTranslation from "../../hooks/useTranslation";

function UsersReportPage() {
  const { t } = useTranslation();
  return (
    <ReportPageTemplate
      title={t("pages.reports.usersTitle")}
      subtitle={t("pages.reports.usersSubtitle")}
      exportFileName="users-report"
      fetcher={reportsApi.users}
    />
  );
}

export default UsersReportPage;
