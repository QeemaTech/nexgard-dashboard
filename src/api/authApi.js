import axiosClient from "./axiosClient";

const authApi = {
  login: (payload) => axiosClient.post("/admin/auth/login", payload),
  me: () => axiosClient.get("/admin/auth/me"),
  logout: () => axiosClient.post("/admin/auth/logout")
};

export default authApi;
