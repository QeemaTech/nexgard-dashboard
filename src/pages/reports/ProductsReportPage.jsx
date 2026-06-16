import reportsApi from "../../api/reportsApi";
import ReportPageTemplate from "./ReportPageTemplate";
import useTranslation from "../../hooks/useTranslation";

function ProductsReportPage() {
  const { t } = useTranslation();
  return (
    <ReportPageTemplate
      title={t("pages.reports.productsTitle")}
      subtitle={t("pages.reports.productsSubtitle")}
      exportFileName="products-report"
      fetcher={reportsApi.products}
    />
  );
}

export default ProductsReportPage;
