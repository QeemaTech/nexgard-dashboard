import axiosClient from "./axiosClient";

const scansApi = {
  list: (params) => axiosClient.get("/admin/scans", { params }),
  getById: (id) => axiosClient.get(`/admin/scans/${id}`),
  review: (id, payload) => axiosClient.patch(`/admin/scans/${id}/review`, payload)
};

export default scansApi;
