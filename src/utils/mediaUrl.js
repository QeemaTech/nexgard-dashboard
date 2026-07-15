const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");

export function resolveMediaUrl(path) {
  if (!path) return null;
  if (/^(https?:|blob:)/i.test(path)) return path;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${API_ORIGIN}/${path}`;
}

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
