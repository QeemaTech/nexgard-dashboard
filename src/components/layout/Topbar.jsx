import { Bell, ChevronRight, Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTranslation from "../../hooks/useTranslation";
import { getRouteMeta } from "../../utils/routeMeta";
import ThemeControls from "./ThemeControls";

function Topbar({ onToggleMobile, onToggleDesktop, desktopCollapsed, mobileOpen }) {
  const { admin } = useAuth();
  const { t, isRtl } = useTranslation();
  const { pathname } = useLocation();
  const { title, section } = getRouteMeta(pathname, t);
  const avatarSeed = encodeURIComponent(admin?.fullName || admin?.email || "admin");

  return (
    <header className="topbar-panel relative z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sm:h-[4.5rem] sm:px-6 lg:h-20 lg:px-10">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex rounded-2xl p-2.5 text-muted transition hover:bg-panel lg:hidden"
          onClick={onToggleMobile}
          aria-label={t("topbar.toggleSidebar")}
          aria-expanded={mobileOpen}
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="hidden rounded-2xl p-2.5 text-muted transition hover:bg-panel lg:inline-flex"
          onClick={onToggleDesktop}
          aria-label={desktopCollapsed ? t("topbar.expandSidebar") : t("topbar.collapseSidebar")}
          aria-expanded={!desktopCollapsed}
        >
          {desktopCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>

        <div className="min-w-0">
          <h2 className="display-font truncate text-base font-extrabold capitalize tracking-tight text-primary sm:text-lg lg:text-xl">
            {title}
          </h2>
          <div className="mt-0.5 hidden items-center gap-2 sm:flex">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {t("topbar.controlCenter")}
            </span>
            <ChevronRight className={`h-3 w-3 shrink-0 text-muted ${isRtl ? "rotate-180" : ""}`} />
            <span className="truncate text-[10px] font-bold uppercase tracking-widest text-blue-600">
              {section}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-4">
        <ThemeControls compact />

        <Link
          to="/app/notifications"
          className="relative rounded-2xl p-2.5 text-muted transition hover:bg-panel hover:text-primary sm:p-3"
          title={t("topbar.notifications")}
          aria-label={t("topbar.notifications")}
        >
          <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute end-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-default bg-red-500 sm:end-3 sm:top-3 sm:h-2.5 sm:w-2.5" />
        </Link>

        <div className="flex items-center gap-2 border-s border-default ps-2 sm:gap-4 sm:ps-4 lg:ps-6">
          <div className="hidden text-end md:block">
            <p className="max-w-[160px] truncate text-sm font-extrabold text-primary">
              {admin?.fullName || t("topbarExtra.admin")}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {t("topbar.executiveAccess")}
            </p>
          </div>
          <div className="avatar-ring h-10 w-10 overflow-hidden rounded-2xl p-0.5 sm:h-12 sm:w-12">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=eff6ff`}
              alt={admin?.fullName || t("topbarExtra.adminProfile")}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
