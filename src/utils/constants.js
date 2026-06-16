export const APP_NAME = "NexApp";
export const APP_SUBTITLE = "Super Admin";

export const STATUS_COLORS = {
  ACTIVE:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
  INACTIVE:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600",
  SUSPENDED:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  USED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  UNUSED:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
  EXPIRED:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  PENDING:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  RESOLVED:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
  CLOSED:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600",
  REJECTED:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  COMPLETED:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
  PROCESSING:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  DRAFT:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
};

export const DEFAULT_PAGE_SIZE = 10;

export const SIDEBAR_ITEMS = [
  {
    labelKey: "nav.overview",
    shortLabel: "OV",
    path: "/app/overview",
    permissions: ["reports.view"],
    icon: "LayoutDashboard"
  },
  {
    labelKey: "nav.users",
    shortLabel: "US",
    path: "/app/users",
    permissions: ["users.view"],
    icon: "Users"
  },
  {
    labelKey: "nav.pets",
    shortLabel: "PT",
    path: "/app/pets",
    permissions: ["pets.view"],
    icon: "Heart"
  },
  {
    labelKey: "nav.products",
    shortLabel: "PR",
    path: "/app/products",
    permissions: ["products.view"],
    icon: "Package"
  },
  {
    labelKey: "nav.qrcodes",
    shortLabel: "QR",
    path: "/app/qrcodes",
    permissions: ["qrcodes.view"],
    icon: "QrCode"
  },
  {
    labelKey: "nav.points",
    shortLabel: "PO",
    path: "/app/points",
    permissions: ["points.view"],
    icon: "Ticket"
  },
  {
    labelKey: "nav.rewards",
    shortLabel: "RW",
    path: "/app/rewards",
    permissions: ["rewards.view"],
    icon: "Gift"
  },
  {
    labelKey: "nav.redemptions",
    shortLabel: "RD",
    path: "/app/redemptions",
    permissions: ["redeem_codes.view"],
    icon: "Award"
  },
  {
    labelKey: "nav.clinics",
    shortLabel: "CL",
    path: "/app/clinics",
    permissions: ["clinics.view"],
    icon: "Building2"
  },
  {
    labelKey: "nav.doctors",
    shortLabel: "DR",
    path: "/app/doctors",
    permissions: ["doctors.view"],
    icon: "Stethoscope"
  },
  {
    labelKey: "nav.stores",
    shortLabel: "ST",
    path: "/app/stores",
    permissions: ["stores.view"],
    icon: "Store"
  },
  {
    labelKey: "nav.notifications",
    shortLabel: "NT",
    path: "/app/notifications",
    permissions: ["notifications.view"],
    icon: "Bell"
  },
  {
    labelKey: "nav.support",
    shortLabel: "SP",
    path: "/app/support",
    permissions: ["support.view"],
    icon: "MessageSquare"
  },
  {
    labelKey: "nav.reports",
    shortLabel: "RP",
    path: "/app/reports/users",
    permissions: ["reports.view"],
    icon: "FileText",
    children: [
      { labelKey: "nav.reportsOverview", path: "/app/overview", permissions: ["reports.view"] },
      { labelKey: "nav.reportsUsers", path: "/app/reports/users", permissions: ["reports.view"] },
      { labelKey: "nav.reportsProducts", path: "/app/reports/products", permissions: ["reports.view"] },
      { labelKey: "nav.reportsScans", path: "/app/reports/scans", permissions: ["reports.view"] },
      { labelKey: "nav.reportsRewards", path: "/app/reports/rewards", permissions: ["reports.view"] },
      { labelKey: "nav.reportsClinics", path: "/app/reports/clinics", permissions: ["reports.view"] },
      { labelKey: "nav.reportsPoints", path: "/app/reports/points", permissions: ["reports.view"] }
    ]
  },
  {
    labelKey: "nav.adminUsers",
    shortLabel: "AU",
    path: "/app/admin-users",
    permissions: ["admin_users.view"],
    icon: "UserCog"
  },
  {
    labelKey: "nav.roles",
    shortLabel: "RL",
    path: "/app/roles",
    permissions: ["roles.view"],
    icon: "Shield"
  },
  {
    labelKey: "nav.settings",
    shortLabel: "SE",
    path: "/app/settings",
    permissions: ["settings.manage"],
    icon: "Settings"
  }
];
