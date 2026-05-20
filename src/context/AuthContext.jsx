import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = {
  client: { email: "client@nexafreight.com", password: "client123", name: "Arjun Mehta", company: "TechVista Solutions" },
  admin: { email: "admin@nexafreight.com", password: "admin123", name: "Priya Sharma", role: "Operations Manager" }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nexafreight_auth");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem("nexafreight_auth");
      }
    }
    return null;
  });

  const login = (email, password, role) => {
    const account = DEMO_ACCOUNTS[role];

    if (account && email.toLowerCase() === account.email && password === account.password) {
      const userData = {
        email: account.email,
        name: account.name,
        role,
        company: account.company || "NexaFreight Logistics",
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem("nexafreight_auth", JSON.stringify(userData));
      return { success: true };
    }

    const customAccounts = JSON.parse(localStorage.getItem("nexafreight_accounts") || "[]");
    const customAccount = customAccounts.find(
      a => a.email === email && a.password === password && a.role === role
    );

    if (customAccount) {
      const userData = {
        email: customAccount.email,
        name: customAccount.name,
        role,
        company: customAccount.company || "NexaFreight Logistics",
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem("nexafreight_auth", JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: "Invalid email or password." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexafreight_auth");
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
