import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import usePermissions from "../hooks/usePermissions";

function ProtectedRoute({ requiredPermissions = [] }) {
  const { isAuthenticated } = useAuth();
  const { hasAnyPermission } = usePermissions();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermissions.length && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
