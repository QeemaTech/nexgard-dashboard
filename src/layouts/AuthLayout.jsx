import { Outlet } from "react-router-dom";
import Logo from "../components/common/Logo";
import ThemeControls from "../components/layout/ThemeControls";
import DashboardFooter from "../components/layout/DashboardFooter";

function AuthLayout() {
  return (
    <div className="auth-shell flex min-h-screen flex-col bg-app transition-colors duration-300">
      <div className="flex justify-end p-4 sm:p-6">
        <ThemeControls compact />
      </div>
      <div className="flex flex-1 items-center justify-center p-4 pb-6">
        <div className="auth-card w-full max-w-[420px]">
          <div className="auth-brand-header">
            <Logo variant="auth" className="mx-auto auth-logo-enter" />
          </div>
          <div className="auth-form-body px-8 py-8">
            <Outlet />
          </div>
        </div>
      </div>
      <DashboardFooter variant="compact" />
    </div>
  );
}

export default AuthLayout;
