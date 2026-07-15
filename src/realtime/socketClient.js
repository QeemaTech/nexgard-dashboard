import { io } from "socket.io-client";
import { tokenStorage } from "../api/axiosClient";

export const REDEMPTION_EVENTS = {
  CREATED: "redemption:created",
  CONFIRMED: "redemption:confirmed",
  VERIFIED: "redemption:verified",
  USED: "redemption:used"
};

let socket = null;

function resolveSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
  try {
    return new URL(apiBase).origin;
  } catch {
    return "http://localhost:5000";
  }
}

export function getAdminSocket() {
  return socket;
}

export function connectAdminSocket() {
  const token = tokenStorage.get();
  if (!token) return null;

  if (socket?.connected) return socket;

  if (socket) {
    socket.auth = { token, actorType: "admin" };
    socket.connect();
    return socket;
  }

  socket = io(resolveSocketUrl(), {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    autoConnect: true,
    auth: {
      token,
      actorType: "admin"
    }
  });

  socket.on("connect_error", (error) => {
    console.warn("[socket] connect_error:", error.message);
  });

  return socket;
}

export function disconnectAdminSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
