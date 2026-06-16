import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import BrandLoader from "../../components/common/BrandLoader";
import useTranslation from "../../hooks/useTranslation";

function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;

    async function signOut() {
      await logout();
      if (active) navigate("/login", { replace: true });
    }

    signOut();

    return () => {
      active = false;
    };
  }, [logout, navigate]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-app p-6">
      <BrandLoader variant="compact" label={t("sidebar.logout")} />
    </div>
  );
}

export default LogoutPage;
