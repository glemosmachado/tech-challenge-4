import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthApi } from "../api/auth";
import { clearHttpAuth, setHttpAuth } from "../api/http";

const AuthContext = createContext(null);

const STORAGE_KEY = "@tc4_auth";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const role = user?.role || null;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved?.token && saved?.user) {
            setToken(saved.token);
            setUser(saved.user);
            setHttpAuth(saved.token);
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function persist(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    setHttpAuth(nextToken);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser })
    );
  }

  async function signInTeacher(email, password) {
    const res = await AuthApi.loginTeacher(email, password);
    await persist(res.token, res.user);
  }

  async function signInStudent(email, password) {
    const res = await AuthApi.loginStudent(email, password);
    await persist(res.token, res.user);
  }

  async function signOut() {
    setToken(null);
    setUser(null);
    clearHttpAuth();
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      loading,
      user,
      token,
      role,
      isTeacher: role === "teacher",
      isStudent: role === "student",
      signInTeacher,
      signInStudent,
      signOut,
    }),
    [loading, user, token, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}