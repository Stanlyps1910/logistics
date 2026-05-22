import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("sriranga_auth");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem("sriranga_auth");
      }
    }
    return null;
  });

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("sriranga_auth", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message || "Invalid email or password." };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server connection failed. Make sure server is running." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sriranga_auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
