import { http } from "./http";

const TeachersApi = {
  async list(page = 1, limit = 10) {
    const res = await http.get("/teachers", { params: { page, limit } });
    return res.data;
  },

  async getById(id) {
    const res = await http.get(`/teachers/${id}`);
    return res.data;
  },

  async create(input) {
    const res = await http.post("/teachers", input);
    return res.data;
  },

  async update(id, input) {
    const res = await http.put(`/teachers/${id}`, input);
    return res.data;
  },

  async remove(id) {
    const res = await http.delete(`/teachers/${id}`);
    return res.data;
  },
};

export { TeachersApi };
export default TeachersApi;
