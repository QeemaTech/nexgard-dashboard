/** Shared helpers for dashboard translations */

export function interpolate(text, vars = {}) {
  if (typeof text !== "string") return text;
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value ?? "")),
    text
  );
}

export function tStatus(t, value) {
  if (!value) return t("status.UNKNOWN");
  const normalized = String(value).toUpperCase().replace(/\s+/g, "_");
  const key = `status.${normalized}`;
  const translated = t(key);
  return translated !== key ? translated : String(value).replace(/_/g, " ");
}

export function statusSelectOptions(t, statuses, allLabelKey = "filters.allStatuses") {
  return [{ label: t(allLabelKey), value: "" }, ...statuses.map((value) => ({ label: tStatus(t, value), value }))];
}

export function enumSelectOptions(t, values, allLabelKey = "filters.allTypes") {
  return [{ label: t(allLabelKey), value: "" }, ...values.map((value) => ({ label: tStatus(t, value), value }))];
}

export function userStatusSelectOptions(t) {
  return statusSelectOptions(t, ["ACTIVE", "INACTIVE", "SUSPENDED"], "filters.allStatuses");
}

export function qrStatusSelectOptions(t) {
  return statusSelectOptions(
    t,
    ["UNUSED", "USED", "EXPIRED", "DISABLED", "SUSPICIOUS"],
    "filters.allStatuses"
  );
}

export function rewardStatusSelectOptions(t) {
  return statusSelectOptions(t, ["ACTIVE", "INACTIVE", "EXPIRED"], "filters.allStatuses");
}

export function redemptionStatusSelectOptions(t) {
  return statusSelectOptions(t, ["ACTIVE", "USED", "EXPIRED", "CANCELLED"], "filters.allStatuses");
}

export function notificationTypeSelectOptions(t) {
  return enumSelectOptions(
    t,
    ["GENERAL", "POINTS", "REWARD", "REDEEM", "SYSTEM", "SUPPORT"],
    "filters.allTypes"
  );
}

export function pointsTypeSelectOptions(t) {
  return enumSelectOptions(t, ["EARN", "REDEEM", "ADJUSTMENT", "REFUND", "EXPIRE"], "filters.allTypes");
}

export function petTypeSelectOptions(t) {
  return enumSelectOptions(t, ["DOG", "CAT", "OTHER"], "filters.allTypes");
}

export function genderSelectOptions(t) {
  return enumSelectOptions(t, ["UNKNOWN", "MALE", "FEMALE"], "filters.allTypes");
}

export function supportStatusSelectOptions(t) {
  return statusSelectOptions(t, ["OPEN", "PENDING", "RESOLVED", "CLOSED"], "filters.allStatuses");
}

export function productStatusSelectOptions(t) {
  return [
    { label: t("filters.allStatuses"), value: "" },
    { label: tStatus(t, "ACTIVE"), value: "ACTIVE" },
    { label: tStatus(t, "INACTIVE"), value: "INACTIVE" }
  ];
}

export function formStatusOptions(t, statuses = ["ACTIVE", "INACTIVE", "SUSPENDED"]) {
  return statuses.map((value) => ({ label: tStatus(t, value), value }));
}

export function formPetTypeOptions(t) {
  return formStatusOptions(t, ["DOG", "CAT", "OTHER"]);
}

export function formGenderOptions(t) {
  return formStatusOptions(t, ["UNKNOWN", "MALE", "FEMALE"]);
}

export function formRewardStatusOptions(t) {
  return formStatusOptions(t, ["ACTIVE", "INACTIVE", "EXPIRED"]);
}

export function formNotificationTypeOptions(t) {
  return formStatusOptions(t, ["GENERAL", "POINTS", "REWARD", "REDEEM", "SYSTEM", "SUPPORT"]);
}

export function formSupportStatusOptions(t) {
  return formStatusOptions(t, ["OPEN", "PENDING", "RESOLVED", "CLOSED"]);
}
