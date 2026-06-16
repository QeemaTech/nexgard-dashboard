import axiosClient from "./axiosClient";

const settingsApi = {
  get: () => axiosClient.get("/admin/settings"),
  update: (payload) => axiosClient.patch("/admin/settings", payload)
};

export default settingsApi;
