import axiosClient from "./axiosClient";

const redeemApi = {
  list: (params) => axiosClient.get("/admin/redeem-codes", { params }),
  getById: (id) => axiosClient.get(`/admin/redeem-codes/${id}`),
  verify: (payload) => axiosClient.post("/admin/redeem-codes/verify", payload),
  useCode: (payload) => axiosClient.post("/admin/redeem-codes/use", payload)
};

export default redeemApi;
