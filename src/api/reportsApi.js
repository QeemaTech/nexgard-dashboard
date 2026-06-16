import axiosClient from "./axiosClient";

const reportsApi = {
  overview: (params) => axiosClient.get("/admin/reports/overview", { params }),
  users: (params) => axiosClient.get("/admin/reports/users", { params }),
  products: (params) => axiosClient.get("/admin/reports/products", { params }),
  scans: (params) => axiosClient.get("/admin/reports/scans", { params }),
  rewards: (params) => axiosClient.get("/admin/reports/rewards", { params }),
  clinics: (params) => axiosClient.get("/admin/reports/clinics", { params }),
  points: (params) => axiosClient.get("/admin/reports/points", { params })
};

export default reportsApi;
