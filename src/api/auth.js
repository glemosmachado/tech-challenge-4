import { http } from "./http";

const AuthApi = {
  async login(email, password) {
    const res = await http.post("/auth/login", { email, password });
    return res.data;
  },
};

export { AuthApi };
export default AuthApi;