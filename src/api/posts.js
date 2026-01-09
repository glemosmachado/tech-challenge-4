import { http } from "./http";

export const PostsApi = {
  async list() {
    const res = await http.get("/posts");
    return res.data;
  },

  async get(id) {
    const res = await http.get(`/posts/${id}`);
    return res.data;
  },

  async search(query) {
    const res = await http.get("/posts/search", { params: { query } });
    return res.data;
  },

  async create(data) {
    const res = await http.post("/posts", data);
    return res.data;
  },

  async update(id, data) {
    const res = await http.put(`/posts/${id}`, data);
    return res.data;
  },

  async remove(id) {
    const res = await http.delete(`/posts/${id}`);
    return res.data;
  },
};

export default PostsApi;
