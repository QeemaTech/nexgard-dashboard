import axiosClient from "./axiosClient";

const qrcodesApi = {
  generate: (payload) => axiosClient.post("/admin/qrcodes/generate", payload),
  list: (params) => axiosClient.get("/admin/qrcodes", { params }),
  getById: (id) => axiosClient.get(`/admin/qrcodes/${id}`),
  update: (id, payload) => axiosClient.patch(`/admin/qrcodes/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/qrcodes/${id}`),
  exportExcel: (params) =>
    axiosClient.get("/admin/qrcodes/export/excel", {
      params,
      responseType: "blob"
    })
};

export default qrcodesApi;
