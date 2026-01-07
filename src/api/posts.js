import { http } from "./http";

export const PostsApi = {
  list() {
    return http.get("/posts").then((r) => r.data);
  },
  get(id) {
    return http.get(`/posts/${id}`).then((r) => r.data);
  },
  search(query) {
    return http.get("/posts/search", { params: { query } }).then((r) => r.data);
  },
  create(data) {
    return http.post("/posts", data).then((r) => r.data);
  },
  update(id, data) {
    return http.put(`/posts/${id}`, data).then((r) => r.data);
  },
  remove(id) {
    return http.delete(`/posts/${id}`).then((r) => r.data);
  },
};