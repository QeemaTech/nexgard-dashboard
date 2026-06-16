import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import usePermissions from "../hooks/usePermissions";
import { getDefaultDashboardPath } from "../utils/dashboardNavigation";

function ProtectedRoute({ requiredPermissions = [] }) {
  const { isAuthenticated } = useAuth();
  const { hasAnyPermission, permissions } = usePermissions();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermissions.length && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to={getDefaultDashboardPath(permissions)} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
