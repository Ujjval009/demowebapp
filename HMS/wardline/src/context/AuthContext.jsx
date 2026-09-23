import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email && password) {
      setUser({
        name: "Admin User",
        email,
        role: "admin",
      });
      return true;
    }
    return false;
  };

  const register = (name, email, password, role) => {
    setUser({ name, email, role: role || "receptionist" });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
