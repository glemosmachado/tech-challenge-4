import { createContext, useContext, useMemo, useState } from "react";
import { AuthApi } from "../api/auth";
import { clearHttpAuth, setHttpAuth } from "../api/http";

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); 
  const [role, setRole] = useState(null); 

  const isAuthenticated = !!token;

  function applySession(payload) {
    const t = payload?.token || null;
    const u = payload?.user || null;

    if (!t || !u) {
      throw new Error("Resposta de login inválida (token/user).");
    }

    setToken(t);
    setUser(u);
    setRole(u.role || null);
    setHttpAuth(t);
  }

  async function loginTeacher(email, password) {
    const e = String(email || "").trim();
    const p = String(password || "").trim();
    if (!e || !p) throw new Error("E-mail e senha são obrigatórios.");

    const data = await AuthApi.loginTeacher(e, p);
    applySession(data);
  }

  async function loginStudent(email, password) {
    const e = String(email || "").trim();
    const p = String(password || "").trim();
    if (!e || !p) throw new Error("E-mail e senha são obrigatórios.");

    const data = await AuthApi.loginStudent(e, p);
    applySession(data);
  }

  function logout() {
    setToken(null);
    setUser(null);
    setRole(null);
    clearHttpAuth();
  }

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      isAuthenticated,
      isTeacher: role === "teacher",
      isStudent: role === "student",
      loginTeacher,
      loginStudent,
      logout,
    }),
    [token, user, role, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}