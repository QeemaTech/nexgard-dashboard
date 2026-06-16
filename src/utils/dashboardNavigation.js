import { SIDEBAR_ITEMS } from "./constants";

function canOpen(item, permissions = []) {
  const required = item.permissions || [];
  return required.length === 0 || required.some((permission) => permissions.includes(permission));
}

export function getDefaultDashboardPath(permissions = []) {
  for (const item of SIDEBAR_ITEMS) {
    if (item.children?.length) {
      const child = item.children.find((entry) => canOpen(entry, permissions));
      if (child) return child.path;
    }

    if (canOpen(item, permissions)) {
      return item.path;
    }
  }

  return "/unauthorized";
}
