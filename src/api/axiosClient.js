import axios from "axios";

const TOKEN_KEY = "nex_admin_token";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 20000
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error?.response?.data;
    const message = payload?.message || payload?.errors?.[0] || error.message || "Request failed";

    // Keep the API error contract on the rejected Error so callers can branch on
    // `code` and highlight the offending input via `field`.
    const normalizedError = new Error(message);
    normalizedError.status = error?.response?.status || null;
    normalizedError.code = payload?.code || null;
    normalizedError.field = payload?.field || null;
    normalizedError.errors = Array.isArray(payload?.errors) ? payload.errors : [];

    return Promise.reject(normalizedError);
  }
);

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

export default axiosClient;
