import { createContext, useContext, useMemo, useState } from "react";
import { AuthApi } from "../api/auth";
import { setHttpAuth } from "../api/http";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);

  async function login({ role: roleIn, email: emailIn, password }) {
    const res = await AuthApi.login(roleIn, emailIn, password);

    const nextToken = res?.token || null;
    const nextRole = res?.user?.role || roleIn;
    const nextEmail = res?.user?.email || emailIn;
    const nextName = res?.user?.name || null;

    setToken(nextToken);
    setRole(nextRole);
    setEmail(nextEmail);
    setName(nextName);

    setHttpAuth({ token: nextToken, role: nextRole });

    return res;
  }

  function logout() {
    setToken(null);
    setRole(null);
    setEmail(null);
    setName(null);
    setHttpAuth({ token: null, role: null });
  }

  const value = useMemo(
    () => ({
      token,
      role,
      email,
      name,
      login,
      logout,
    }),
    [token, role, email, name]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}