import { Suspense, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import RouteProgressBar from "../components/layout/RouteProgressBar";
import PageLoader from "../components/common/PageLoader";
import DashboardFooter from "../components/layout/DashboardFooter";
import AnimatedPage from "../components/motion/AnimatedPage";
import usePermissions from "../hooks/usePermissions";
import useTranslation from "../hooks/useTranslation";
import { SIDEBAR_ITEMS } from "../utils/constants";

function AdminLayout() {
  const { t } = useTranslation();
  const { hasAnyPermission } = usePermissions();
  const location = useLocation();
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarItems = useMemo(
    () => SIDEBAR_ITEMS.filter((item) => hasAnyPermission(item.permissions)),
    [hasAnyPermission]
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-app text-primary transition-colors duration-300">
      <RouteProgressBar />

      {mobileOpen ? (
        <button
          type="button"
          className="sidebar-backdrop fixed inset-0 z-[65] bg-slate-900/45 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label={t("topbar.closeSidebar")}
        />
      ) : null}

      <Sidebar
        items={sidebarItems}
        collapsed={desktopCollapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          desktopCollapsed={desktopCollapsed}
          mobileOpen={mobileOpen}
          onToggleMobile={() => setMobileOpen((prev) => !prev)}
          onToggleDesktop={() => setDesktopCollapsed((prev) => !prev)}
        />
        <main className="main-content flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-10">
          <Suspense fallback={<PageLoader variant="page" />}>
            <AnimatePresence mode="wait">
              <AnimatedPage key={location.pathname} className="mx-auto w-full max-w-[1600px]">
                <Outlet />
              </AnimatedPage>
            </AnimatePresence>
          </Suspense>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}

export default AdminLayout;
