import axiosClient from "./axiosClient";

const storesApi = {
  list: (params) => axiosClient.get("/admin/stores", { params }),
  getById: (id) => axiosClient.get(`/admin/stores/${id}`),
  create: (payload) => axiosClient.post("/admin/stores", payload),
  update: (id, payload) => axiosClient.patch(`/admin/stores/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/stores/${id}`)
};

export default storesApi;
