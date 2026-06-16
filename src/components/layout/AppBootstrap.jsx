import useAuth from "../../hooks/useAuth";
import useTranslation from "../../hooks/useTranslation";
import BrandLoader from "../common/BrandLoader";

function AppBootstrap({ children }) {
  const { loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <BrandLoader variant="splash" label={t("auth.checkingSession")} />;
  }

  return children;
}

export default AppBootstrap;
