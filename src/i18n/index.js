import en from "./locales/en.json";
import ar from "./locales/ar.json";

export const LOCALES = {
  en: { label: "English", dir: "ltr", messages: en },
  ar: { label: "العربية", dir: "rtl", messages: ar }
};

export const DEFAULT_LOCALE = "en";
export const LOCALE_STORAGE_KEY = "nex-dashboard-locale";

export function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function translate(locale, key, fallbackOrVars, maybeVars) {
  let fallback = key;
  let vars = {};

  if (typeof fallbackOrVars === "string") {
    fallback = fallbackOrVars;
    vars = maybeVars || {};
  } else if (fallbackOrVars && typeof fallbackOrVars === "object") {
    vars = fallbackOrVars;
  }

  const messages = LOCALES[locale]?.messages || LOCALES.en.messages;
  const value = getNestedValue(messages, key);
  const resolved = value ?? fallback;
  if (typeof resolved !== "string") return resolved ?? fallback;

  return Object.entries(vars).reduce(
    (result, [varKey, varValue]) =>
      result.replace(new RegExp(`\\{\\{${varKey}\\}\\}`, "g"), String(varValue ?? "")),
    resolved
  );
}
