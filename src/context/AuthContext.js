import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthApi } from "../api/auth";
import { setHttpAuth } from "../api/http";

const AuthContext = createContext(null);

const STORAGE_KEY = "TC4_AUTH_V1";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // "teacher" | "student" | null
  const [email, setEmail] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const t = parsed?.token ?? null;
          const r = parsed?.role ?? null;
          const e = parsed?.email ?? null;

          setToken(t);
          setRole(r);
          setEmail(e);

          setHttpAuth({ token: t, role: r });
        } else {
          setHttpAuth({ token: null, role: null });
        }
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, []);

  async function loginTeacher(userEmail, password) {
    const res = await AuthApi.login(userEmail, password);

    const nextToken = res?.token;
    const nextRole = "teacher";
    const nextEmail = res?.user?.email || userEmail;

    setToken(nextToken);
    setRole(nextRole);
    setEmail(nextEmail);

    setHttpAuth({ token: nextToken, role: nextRole });

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, role: nextRole, email: nextEmail })
    );
  }

  async function logout() {
    setToken(null);
    setRole(null);
    setEmail(null);

    setHttpAuth({ token: null, role: null });
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      token,
      role,
      email,
      isBootstrapping,
      loginTeacher,
      logout,
    }),
    [token, role, email, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}