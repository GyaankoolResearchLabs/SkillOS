import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch (error) {
      console.error(
        "Failed to load stored user:",
        error
      );

      return null;
    }
  });

  // =====================================================
  // TOKEN
  // =====================================================

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // =====================================================
  // PERSIST USER
  // =====================================================

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // =====================================================
  // PERSIST TOKEN
  // =====================================================

  useEffect(() => {
    if (token) {
      localStorage.setItem(
        "token",
        token
      );
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    setUser(null);
    setToken(null);

    // =================================================
    // IMPORTANT:
    //
    // DO NOT use localStorage.clear()
    //
    // Branding, organization settings and other
    // application configuration must survive logout.
    // =================================================

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // =====================================================
  // AUTH STATUS
  // =====================================================

  const isAuthenticated = !!token;

  // =====================================================
  // ROLE CHECKS
  // =====================================================

  const isManager =
    user?.role === "manager";

  const isEmployee =
    user?.role === "employee";

  const isTeacher =
    user?.role === "teacher";

  const isStudent =
    user?.role === "student";

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = useMemo(
    () => ({
      user,
      token,

      login,
      logout,

      isAuthenticated,

      isManager,
      isEmployee,
      isTeacher,
      isStudent,
    }),
    [
      user,
      token,
      isAuthenticated,
      isManager,
      isEmployee,
      isTeacher,
      isStudent,
    ]
  );

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// AUTH HOOK
// =====================================================

export const useAuth = () =>
  useContext(AuthContext);