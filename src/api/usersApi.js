import axiosClient from "./axiosClient";

const usersApi = {
  list: (params) => axiosClient.get("/admin/users", { params }),
  getById: (id) => axiosClient.get(`/admin/users/${id}`),
  update: (id, payload) => axiosClient.patch(`/admin/users/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/users/${id}`)
};

export default usersApi;
