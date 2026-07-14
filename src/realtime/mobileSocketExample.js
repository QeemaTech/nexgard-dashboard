/**
 * Mobile (user) Socket.IO client — copy into the mobile app.
 *
 * Connect:
 *   io(BASE_URL, {
 *     path: "/socket.io",
 *     auth: { token: USER_JWT, actorType: "user" }
 *   })
 *
 * Rooms joined automatically by server: user:{userId}
 *
 * Listen:
 *   socket.on("socket:ready", ...)
 *   socket.on("redemption:confirmed", ...)  // after user redeems (points deducted)
 *   socket.on("redemption:used", ...)       // after doctor marks code USED
 */

export const MOBILE_REDEMPTION_EVENTS = {
  READY: "socket:ready",
  CONFIRMED: "redemption:confirmed",
  USED: "redemption:used"
};

export function createUserSocketExample() {
  return `
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  path: "/socket.io",
  auth: {
    token: USER_ACCESS_TOKEN,
    actorType: "user"
  }
});

socket.on("socket:ready", (data) => {
  console.log("joined rooms", data.rooms);
});

socket.on("redemption:confirmed", (payload) => {
  // Update wallet + show redeem code / QR
  // payload.walletBalance, payload.redeemCode.code
});

socket.on("redemption:used", (payload) => {
  // Mark redemption as USED on the user screen
  // payload.code, payload.status === "USED"
});
`.trim();
}
