import axiosClient from "./axiosClient";

const productsApi = {
  list: (params) => axiosClient.get("/admin/products", { params }),
  getById: (id) => axiosClient.get(`/admin/products/${id}`),
  create: (payload) => axiosClient.post("/admin/products", payload),
  update: (id, payload) => axiosClient.patch(`/admin/products/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/products/${id}`),
  addImage: (id, payload, isFormData = false) =>
    axiosClient.post(`/admin/products/${id}/images`, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
    }),
  removeImage: (id, imageId) => axiosClient.delete(`/admin/products/${id}/images/${imageId}`),
  addBenefit: (id, payload) => axiosClient.post(`/admin/products/${id}/benefits`, payload),
  updateBenefit: (id, benefitId, payload) =>
    axiosClient.patch(`/admin/products/${id}/benefits/${benefitId}`, payload),
  removeBenefit: (id, benefitId) => axiosClient.delete(`/admin/products/${id}/benefits/${benefitId}`)
};

export default productsApi;
