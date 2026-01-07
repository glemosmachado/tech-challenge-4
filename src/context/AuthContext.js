import { createContext, useMemo, useState } from "react";
import { setHttpRole } from "../api/http";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const value = useMemo(
    () => ({
      token,
      role,
      isAuthenticated: !!token,

      signInFakeAsTeacher: async () => {
        setToken("fake-token");
        setRole("teacher");
        setHttpRole("teacher");
      },

      signOut: async () => {
        setToken(null);
        setRole(null);
        setHttpRole(null);
      },
    }),
    [token, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
