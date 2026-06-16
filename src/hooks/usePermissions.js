import { useContext } from "react";
import { PermissionContext } from "../context/PermissionContext";

function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionProvider");
  }
  return context;
}

export default usePermissions;
