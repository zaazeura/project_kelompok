"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string) => {
    setUser({
      name: email.split("@")[0],
      email,
      phone: "+62 812 3456 7890",
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
    });
    return true;
  }, []);

  const register = useCallback((name: string, email: string, _password: string) => {
    setUser({
      name,
      email,
      phone: "",
      address: "",
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
