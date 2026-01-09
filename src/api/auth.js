import { http } from "./http";

async function postJson(url, body) {
  const res = await http.post(url, body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export const AuthApi = {
  async loginTeacher(email, password) {
    return await postJson("/auth/login", { email, password });
  },

  async loginStudent(email, password) {
    try {
      return await postJson("/auth/login-student", { email, password });
    } catch (err) {
      const status = err?.response?.status;
      if (status && status !== 404) throw err;
      return await postJson("/auth/login/student", { email, password });
    }
  },
};