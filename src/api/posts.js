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
    try {
      const res = await http.get(`/posts/${id}`);
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
    try {
      const res = await http.put(`/posts/${id}`, payload);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to update post"));
    }
  },

  async remove(id) {
    try {
      const res = await http.delete(`/posts/${id}`);
      return res.data;
    } catch (e) {
      throw new Error(errMsg(e, "Failed to delete post"));
    }
  },
};
