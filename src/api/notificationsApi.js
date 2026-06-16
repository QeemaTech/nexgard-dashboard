import axiosClient from "./axiosClient";

const notificationsApi = {
  list: (params) => axiosClient.get("/admin/notifications", { params }),
  send: (payload) => axiosClient.post("/admin/notifications/send", payload)
};

export default notificationsApi;
