import { http } from "./http";

function errMsg(e, fallback) {
  return e?.response?.data?.message || e?.message || fallback || "Request failed";
}

export const TeachersApi = {
  async list(page = 1, limit = 10) {
    try {
      const res = await http.get(`/teachers?page=${page}&limit=${limit}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to list teachers"));
    }
  },

  async getById(id) {
    try {
      const res = await http.get(`/teachers/${id}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to get teacher"));
    }
  },

  async create(payload) {
    try {
      const res = await http.post("/teachers", payload);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to create teacher"));
    }
  },

  async update(id, payload) {
    try {
      const res = await http.put(`/teachers/${id}`, payload);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to update teacher"));
    }
  },

  async remove(id) {
    try {
      const res = await http.delete(`/teachers/${id}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to delete teacher"));
    }
  },
};
