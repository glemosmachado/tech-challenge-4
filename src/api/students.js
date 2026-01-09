import { http } from "./http";

const StudentsApi = {
  async list(page = 1, limit = 10) {
    const res = await http.get("/students", { params: { page, limit } });
    return res.data; // { items, page, limit, total, totalPages }
  },

  async getById(id) {
    const res = await http.get(`/students/${id}`);
    return res.data;
  },

  async create(input) {
    const res = await http.post("/students", input);
    return res.data;
  },

  async update(id, input) {
    const res = await http.put(`/students/${id}`, input);
    return res.data;
  },

  async remove(id) {
    const res = await http.delete(`/students/${id}`);
    return res.data;
  },
};

export { StudentsApi };
export default StudentsApi;