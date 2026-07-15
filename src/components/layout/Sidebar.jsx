import { useState } from "react";
import {
  Activity,
  Award,
  Bell,
  Building2,
  ChevronDown,
  FileText,
  Gift,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  QrCode,
  ScanLine,
  Settings,
  Shield,
  Stethoscope,
  Store,
  Ticket,
  UserCog,
  Users,
  X
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import usePermissions from "../../hooks/usePermissions";
import useTranslation from "../../hooks/useTranslation";
import Logo from "../common/Logo";

const ICONS = {
  LayoutDashboard,
  Users,
  Heart,
  Package,
  QrCode,
  ScanLine,
  Ticket,
  Gift,
  Award,
  Building2,
  Stethoscope,
  Store,
  Bell,
  MessageSquare,
  FileText,
  UserCog,
  Shield,
  Settings
};

function SidebarItem({ item, collapsed, onNavigate }) {
  const { t } = useTranslation();
  const Icon = ICONS[item.icon] || LayoutDashboard;
  const label = t(item.labelKey);

  return (
    <NavLink
      to={item.path}
      end={item.path === "/app/overview"}
      onClick={() => onNavigate?.()}
      className={({ isActive }) =>
        `sidebar-nav-item relative flex w-full items-center gap-3 text-sm font-medium transition-all ${
          collapsed ? "px-4 py-2.5 lg:justify-center lg:px-3 lg:py-3" : "px-4 py-2.5"
        } ${isActive ? "sidebar-item-active" : "sidebar-nav-idle"}`
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isActive ? "sidebar-icon-active" : "sidebar-icon-idle"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
          {!collapsed ? <span className="truncate">{label}</span> : <span className="truncate lg:hidden">{label}</span>}
        </>
      )}
    </NavLink>
  );
}

function SidebarGroup({ item, collapsed, onNavigate }) {
  const { hasAnyPermission } = usePermissions();
  const { t } = useTranslation();
  const location = useLocation();
  const Icon = ICONS[item.icon] || FileText;
  const label = t(item.labelKey);
  const children = (item.children || []).filter((child) =>
    hasAnyPermission(child.permissions || item.permissions)
  );
  const isReportsActive = location.pathname.startsWith("/app/reports") || location.pathname === "/app/overview";
  const [open, setOpen] = useState(isReportsActive);

  if (!children.length) return null;

  if (collapsed) {
    return <SidebarItem item={{ ...item, path: children[0].path }} collapsed={collapsed} onNavigate={onNavigate} />;
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`sidebar-nav-item flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
          isReportsActive ? "sidebar-item-active" : "sidebar-nav-idle"
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            isReportsActive ? "sidebar-icon-active" : "sidebar-icon-idle"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="flex-1 truncate text-start">{label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="ms-6 space-y-1 border-s border-default ps-3">
          {children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              end={child.path === "/app/overview"}
              onClick={() => onNavigate?.()}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm transition-all ${
                  isActive ? "sidebar-item-active" : "sidebar-nav-idle"
                }`
              }
            >
              {t(child.labelKey)}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Sidebar({ items, collapsed, mobileOpen, onNavigate, onCloseMobile }) {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const showCollapsed = collapsed && !mobileOpen;

  return (
    <aside
      className={`sidebar-panel fixed inset-y-0 start-0 z-[70] flex h-[100dvh] w-[min(20rem,calc(100vw-3rem))] max-w-[85vw] flex-col border-e transition-[transform,width] duration-300 ease-out lg:sticky lg:top-0 lg:z-[60] lg:max-w-none lg:translate-x-0 ${
        mobileOpen
          ? "translate-x-0 shadow-2xl"
          : "-translate-x-full rtl:translate-x-full lg:rtl:translate-x-0"
      } ${collapsed ? "lg:w-20" : "lg:w-72"}`}
    >
      <div
        className={`sidebar-brand flex shrink-0 items-center border-b border-default ${
          showCollapsed ? "mb-3 justify-between px-3 py-4 lg:justify-center" : "mb-2 justify-between px-4 py-5 sm:px-5 sm:py-6"
        }`}
      >
        <Logo variant="sidebar" collapsed={showCollapsed} />
        <button
          type="button"
          className="rounded-xl p-2 text-muted transition hover:bg-panel hover:text-primary lg:hidden"
          onClick={onCloseMobile}
          aria-label={t("topbar.closeSidebar")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
        <div className="space-y-1">
          {items.map((item) =>
            item.children?.length ? (
              <SidebarGroup
                key={item.path}
                item={item}
                collapsed={showCollapsed}
                onNavigate={onNavigate}
              />
            ) : (
              <SidebarItem
                key={item.path}
                item={item}
                collapsed={showCollapsed}
                onNavigate={onNavigate}
              />
            )
          )}
        </div>
      </nav>

      <div className={`shrink-0 border-t border-default ${showCollapsed ? "p-3" : "p-4 sm:p-5"}`}>
        {!showCollapsed ? (
          <div className="server-status-card panel-muted mb-4 rounded-2xl border p-3 sm:mb-5 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="server-status-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-default bg-panel">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  {t("sidebar.serverStatus")}
                </p>
                <p className="truncate text-xs font-bold text-primary">{t("sidebar.serverOnline")}</p>
              </div>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={logout}
          className={`logout-btn flex w-full items-center gap-3 rounded-2xl text-sm font-bold uppercase tracking-widest text-red-500 transition-all ${
            showCollapsed ? "justify-center px-3 py-3" : "px-4 py-3"
          }`}
          title={t("sidebar.logout")}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!showCollapsed ? <span>{t("sidebar.logout")}</span> : null}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
