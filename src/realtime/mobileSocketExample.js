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
 * Events:
 *   redemption:confirmed  → Step 1 POST /rewards/:id/redeem
 *                           phase:"issued"  step:1  pointsDeducted:false
 *   redemption:used       → Step 2 from clinic/admin, OR other devices
 *                           phase:"completed" step:2
 *                           NOTE: same-device /redeem/confirm uses HTTP body;
 *                           user-room socket echo is skipped to avoid event clash.
 *
 * Always key UI updates by payload.redemptionId + payload.seq / payload.phase.
 */

export const MOBILE_REDEMPTION_EVENTS = {
  READY: "socket:ready",
  CONFIRMED: "redemption:confirmed",
  USED: "redemption:used"
};

export function createUserSocketExample() {
  return `
import { io } from "socket.io-client";

const socket = io("https://nexgard.nodeteam.site", {
  path: "/socket.io",
  auth: {
    token: USER_ACCESS_TOKEN,
    actorType: "user"
  }
});

let lastSeqByRedemption = {};

function shouldApply(payload) {
  const id = payload.redemptionId;
  const seq = payload.seq || 0;
  if (!id) return true;
  if ((lastSeqByRedemption[id] || 0) >= seq) return false; // stale / duplicate
  lastSeqByRedemption[id] = seq;
  return true;
}

socket.on("socket:ready", (data) => {
  console.log("joined rooms", data.rooms);
});

// Step 1 — code created, NO points deducted yet
socket.on("redemption:confirmed", (payload) => {
  if (payload.phase !== "issued" && payload.step !== 1) return;
  if (!shouldApply(payload)) return;
  // show QR / code — do NOT treat as deducted
  // payload.redeemCode, payload.pointsPending, payload.walletBalance
});

// Step 2 — completed (usually from clinic; or another device)
socket.on("redemption:used", (payload) => {
  if (payload.phase !== "completed" && payload.step !== 2) return;
  if (!shouldApply(payload)) return;
  // update wallet / mark used
  // payload.pointsCharged, payload.walletBalance
});
`.trim();
}
