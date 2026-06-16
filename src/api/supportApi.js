import axiosClient from "./axiosClient";

const supportApi = {
  listConversations: (params) => axiosClient.get("/admin/support/conversations", { params }),
  getConversation: (id) => axiosClient.get(`/admin/support/conversations/${id}`),
  reply: (id, payload, isFormData = false) =>
    axiosClient.post(`/admin/support/conversations/${id}/messages`, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
    }),
  updateStatus: (id, payload) => axiosClient.patch(`/admin/support/conversations/${id}/status`, payload)
};

export default supportApi;
