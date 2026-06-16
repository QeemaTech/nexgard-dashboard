import axiosClient from "./axiosClient";

const doctorsApi = {
  list: (params) => axiosClient.get("/admin/doctors", { params }),
  getById: (id) => axiosClient.get(`/admin/doctors/${id}`),
  create: (payload) => axiosClient.post("/admin/doctors", payload),
  update: (id, payload) => axiosClient.patch(`/admin/doctors/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/doctors/${id}`)
};

export default doctorsApi;
