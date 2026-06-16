export const MODULE_PERMISSIONS = {
  overview: ["reports.view"],
  users: ["users.view"],
  pets: ["pets.view"],
  products: ["products.view"],
  qrcodes: ["qrcodes.view"],
  points: ["points.view"],
  rewards: ["rewards.view"],
  redemptions: ["redeem_codes.view"],
  clinics: ["clinics.view"],
  doctors: ["doctors.view"],
  stores: ["stores.view"],
  notifications: ["notifications.view"],
  support: ["support.view"],
  reports: ["reports.view"],
  adminUsers: ["admin_users.view"],
  roles: ["roles.view"],
  settings: ["settings.manage"]
};

export function canAccess(permissionChecker, moduleKey) {
  const required = MODULE_PERMISSIONS[moduleKey] || [];
  return permissionChecker(required);
}
