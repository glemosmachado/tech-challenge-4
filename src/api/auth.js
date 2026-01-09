import { http } from "./http";

function errMsg(e, fallback) {
  return (
    e?.response?.data?.message ||
    e?.message ||
    fallback ||
    "Request failed"
  );
}

export const AuthApi = {
  async login(role, email, password) {
    try {
      const res = await http.post("/auth/login", {
        role,
        email,
        password,
      });
      return res.data; // { token, user }
    } catch (e) {
      throw new Error(errMsg(e, "Failed to login"));
    }
  },

  async loginTeacher(email, password) {
    return this.login("teacher", email, password);
  },

  async loginStudent(email, password) {
    return this.login("student", email, password);
  },
};
