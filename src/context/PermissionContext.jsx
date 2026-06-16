import { createContext, useMemo } from "react";
import useAuth from "../hooks/useAuth";

const EMPTY_PERMISSIONS = [];
const EMPTY_ROLES = [];

export const PermissionContext = createContext(null);

export function PermissionProvider({ children }) {
  const { admin } = useAuth();
  const permissions = admin?.permissions ?? EMPTY_PERMISSIONS;
  const roles = admin?.roles ?? EMPTY_ROLES;

  const value = useMemo(
    () => ({
      permissions,
      roles,
      hasPermission: (permission) => permissions.includes(permission),
      hasAnyPermission: (requiredPermissions = []) =>
        requiredPermissions.length === 0 ||
        requiredPermissions.some((permission) => permissions.includes(permission)),
      hasRole: (role) => roles.includes(role)
    }),
    [permissions, roles]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}
