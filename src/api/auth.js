import { http } from "./http";

export const AuthApi = {
  async login(role, email, password) {
    const res = await http.post("/auth/login", { role, email, password });
    return res.data;
  },
};

export default AuthApi;