import axiosClient from "./axiosClient";

const pointsApi = {
  listTransactions: (params) => axiosClient.get("/admin/points/transactions", { params }),
  adjustPoints: (payload) => axiosClient.post("/admin/points/adjust", payload)
};

export default pointsApi;
