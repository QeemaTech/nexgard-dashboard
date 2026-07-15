import axiosClient from "./axiosClient";

const redemptionsApi = {
  list: (params) => axiosClient.get("/admin/redemptions", { params }),
  getById: (id) => axiosClient.get(`/admin/redemptions/${id}`)
};

export default redemptionsApi;
