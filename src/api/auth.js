import { http } from "./http";

async function postJson(url, body) {
  const res = await http.post(url, body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

async function tryMany(attempts) {
  let lastErr = null;
  for (const fn of attempts) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = err?.response?.status;
      if (status && status !== 404) throw err;
    }
  }
  throw lastErr || new Error("Falha ao autenticar");
}

export const AuthApi = {
  async loginTeacher(email, password) {
    const payload = { role: "teacher", email, password };

    return await tryMany([
      () => postJson("/auth/login", payload),
      () => postJson("/auth/login-teacher", { email, password }),
      () => postJson("/auth/login/teacher", { email, password }),
    ]);
  },

  async loginStudent(email, password) {
    const payload = { role: "student", email, password };

    return await tryMany([
      () => postJson("/auth/login", payload),
      () => postJson("/auth/login-student", { email, password }),
      () => postJson("/auth/login/student", { email, password }),
    ]);
  },
};
