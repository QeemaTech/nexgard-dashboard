import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import useAuth from "./useAuth";
import useTranslation from "./useTranslation";
import {
  connectAdminSocket,
  disconnectAdminSocket,
  REDEMPTION_EVENTS
} from "../realtime/socketClient";

/**
 * Connects admin/doctor to Socket.IO while authenticated and listens
 * for redemption realtime events.
 *
 * Events:
 * - redemption:created  → user just redeemed (points already deducted)
 * - redemption:verified → code verified at clinic
 * - redemption:used     → code marked USED at clinic
 */
function useRedeemRealtime({ onEvent } = {}) {
  const { isAuthenticated, admin } = useAuth();
  const { t } = useTranslation();
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!isAuthenticated || !admin) {
      disconnectAdminSocket();
      return undefined;
    }

    const socket = connectAdminSocket();
    if (!socket) return undefined;

    function handleCreated(payload) {
      const name = payload?.user?.fullName || t("tables.user");
      const code = payload?.redeemCode?.code || payload?.code;
      toast.success(`${name}: ${code || t("tables.code")}`);
      onEventRef.current?.(REDEMPTION_EVENTS.CREATED, payload);
    }

    function handleVerified(payload) {
      onEventRef.current?.(REDEMPTION_EVENTS.VERIFIED, payload);
    }

    function handleUsed(payload) {
      const code = payload?.code || payload?.redeemCode?.code;
      toast.success(code ? `${code} → USED` : "Redeem code used");
      onEventRef.current?.(REDEMPTION_EVENTS.USED, payload);
    }

    function handleReady(payload) {
      onEventRef.current?.("socket:ready", payload);
    }

    socket.on("socket:ready", handleReady);
    socket.on(REDEMPTION_EVENTS.CREATED, handleCreated);
    socket.on(REDEMPTION_EVENTS.VERIFIED, handleVerified);
    socket.on(REDEMPTION_EVENTS.USED, handleUsed);

    return () => {
      socket.off("socket:ready", handleReady);
      socket.off(REDEMPTION_EVENTS.CREATED, handleCreated);
      socket.off(REDEMPTION_EVENTS.VERIFIED, handleVerified);
      socket.off(REDEMPTION_EVENTS.USED, handleUsed);
    };
  }, [isAuthenticated, admin, t]);

  useEffect(() => {
    if (isAuthenticated) return undefined;
    disconnectAdminSocket();
    return undefined;
  }, [isAuthenticated]);
}

export default useRedeemRealtime;
