import axiosClient from "./axiosClient";

const rewardsApi = {
  list: (params) => axiosClient.get("/admin/rewards", { params }),
  getById: (id) => axiosClient.get(`/admin/rewards/${id}`),
  create: (payload, isFormData = false) =>
    axiosClient.post("/admin/rewards", payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
    }),
  update: (id, payload, isFormData = false) =>
    axiosClient.patch(`/admin/rewards/${id}`, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
    }),
  remove: (id) => axiosClient.delete(`/admin/rewards/${id}`),
  assignClinic: (id, payload) => axiosClient.post(`/admin/rewards/${id}/clinics`, payload),
  removeClinic: (id, clinicId) => axiosClient.delete(`/admin/rewards/${id}/clinics/${clinicId}`)
};

export default rewardsApi;
