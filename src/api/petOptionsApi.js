import axiosClient from "./axiosClient";

const petOptionsApi = {
  all: () => axiosClient.get("/admin/pet-options"),

  weightRanges: {
    list: (params) => axiosClient.get("/admin/pet-options/weight-ranges", { params }),
    getById: (id) => axiosClient.get(`/admin/pet-options/weight-ranges/${id}`),
    create: (payload) => axiosClient.post("/admin/pet-options/weight-ranges", payload),
    update: (id, payload) => axiosClient.patch(`/admin/pet-options/weight-ranges/${id}`, payload),
    remove: (id) => axiosClient.delete(`/admin/pet-options/weight-ranges/${id}`)
  },

  ageRanges: {
    list: (params) => axiosClient.get("/admin/pet-options/age-ranges", { params }),
    getById: (id) => axiosClient.get(`/admin/pet-options/age-ranges/${id}`),
    create: (payload) => axiosClient.post("/admin/pet-options/age-ranges", payload),
    update: (id, payload) => axiosClient.patch(`/admin/pet-options/age-ranges/${id}`, payload),
    remove: (id) => axiosClient.delete(`/admin/pet-options/age-ranges/${id}`)
  }
};

export default petOptionsApi;
