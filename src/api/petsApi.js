import axiosClient from "./axiosClient";

const petsApi = {
  list: (params) => axiosClient.get("/admin/pets", { params }),
  getById: (id) => axiosClient.get(`/admin/pets/${id}`),
  update: (id, payload) => axiosClient.patch(`/admin/pets/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/pets/${id}`)
};

export default petsApi;
