import { http } from "./http";

function errMsg(e, fallback) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    fallback ||
    "Request failed"
  );
}

function normalizeId(id) {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object") return String(id._id || id.id || "");
  return String(id);
}

export const PostsApi = {
  async list() {
    try {
      const res = await http.get("/posts");
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to list posts"));
    }
  },

  async search(query) {
    try {
      const res = await http.get("/posts/search", { params: { query } });
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to search posts"));
    }
  },

  async getById(id) {
    const pid = normalizeId(id);
    try {
      const res = await http.get(`/posts/${pid}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to get post"));
    }
  },

  async create(payload) {
    try {
      const res = await http.post("/posts", payload);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to create post"));
    }
  },

  async update(id, payload) {
    const pid = normalizeId(id);
    try {
      const res = await http.put(`/posts/${pid}`, payload);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to update post"));
    }
  },

  async remove(id) {
    const pid = normalizeId(id);
    try {
      const res = await http.delete(`/posts/${pid}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to delete post"));
    }
  },
};