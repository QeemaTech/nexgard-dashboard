import axiosClient from "./axiosClient";

const rolesApi = {
  listAdminUsers: (params) => axiosClient.get("/admin/admin-users", { params }),
  getAdminUser: (id) => axiosClient.get(`/admin/admin-users/${id}`),
  createAdminUser: (payload) => axiosClient.post("/admin/admin-users", payload),
  updateAdminUser: (id, payload) => axiosClient.patch(`/admin/admin-users/${id}`, payload),
  deleteAdminUser: (id) => axiosClient.delete(`/admin/admin-users/${id}`),
  listRoles: (params) => axiosClient.get("/admin/roles", { params }),
  getRole: (id) => axiosClient.get(`/admin/roles/${id}`),
  createRole: (payload) => axiosClient.post("/admin/roles", payload),
  updateRole: (id, payload) => axiosClient.patch(`/admin/roles/${id}`, payload),
  deleteRole: (id) => axiosClient.delete(`/admin/roles/${id}`),
  updateRolePermissions: (id, payload) => axiosClient.patch(`/admin/roles/${id}/permissions`, payload),
  listPermissions: (params) => axiosClient.get("/admin/permissions", { params })
};

export default rolesApi;
