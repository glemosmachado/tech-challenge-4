import { http } from "./http";

function errMsg(e, fallback) {
  return (
    e?.response?.data?.message ||
    e?.message ||
    fallback ||
    "Request failed"
  );
}

export const StudentsApi = {
  async list(page = 1, limit = 10) {
    try {
      const res = await http.get(`/students?page=${page}&limit=${limit}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to list students"));
    }
  },

  async getById(id) {
    try {
      const res = await http.get(`/students/${id}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to get student"));
    }
  },

  async create(payload) {
    try {
      const res = await http.post("/students", payload);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to create student"));
    }
  },

  async update(id, payload) {
    try {
      const res = await http.put(`/students/${id}`, payload);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to update student"));
    }
  },

  async remove(id) {
    try {
      const res = await http.delete(`/students/${id}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to delete student"));
    }
  },
};
