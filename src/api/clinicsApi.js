import axiosClient from "./axiosClient";

const clinicsApi = {
  list: (params) => axiosClient.get("/admin/clinics", { params }),
  getById: (id) => axiosClient.get(`/admin/clinics/${id}`),
  create: (payload) => axiosClient.post("/admin/clinics", payload),
  update: (id, payload) => axiosClient.patch(`/admin/clinics/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/clinics/${id}`)
};

export default clinicsApi;
