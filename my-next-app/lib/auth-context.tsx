"use client";

import { createContext, useContext, useCallback, useSyncExternalStore, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<AuthResult>;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => { valid: boolean; errors: string[] };
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "foodsaver_users";
const SESSION_KEY = "foodsaver_session";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "foodsaver_salt_v1");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function validateEmailFormat(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Minimal 8 karakter");
  if (!/[A-Z]/.test(password)) errors.push("Harus mengandung huruf besar");
  if (!/[a-z]/.test(password)) errors.push("Harus mengandung huruf kecil");
  if (!/[0-9]/.test(password)) errors.push("Harus mengandung angka");
  return errors;
}

let storeVersion = 0;

function emitChange() {
  storeVersion++;
  listeners.forEach((l) => l());
}

const listeners: Array<() => void> = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function getSnapshot(): number {
  return storeVersion;
}

function getServerSnapshot(): number {
  return 0;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const version = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const currentUser = getSession();

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const passwordHash = await hashPassword(password);
    const found = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.passwordHash === passwordHash
    );
    if (!found) {
      return { success: false, error: "Email atau password salah" };
    }
    const userData: User = {
      name: found.name,
      email: found.email,
      phone: found.phone,
      address: found.address,
    };
    saveSession(userData);
    emitChange();
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: "Email sudah terdaftar" };
    }
    const passwordHash = await hashPassword(password);
    const newUser: StoredUser = {
      name: name.trim(),
      email: trimmedEmail,
      phone: "",
      address: "",
      passwordHash,
    };
    users.push(newUser);
    saveStoredUsers(users);
    const userData: User = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
    };
    saveSession(userData);
    emitChange();
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    emitChange();
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    const user = getSession();
    if (!user) return;
    const updated = { ...user, ...data };
    saveSession(updated);
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveStoredUsers(users);
    }
    emitChange();
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const user = getSession();
    if (!user) return { success: false, error: "Tidak ada sesi aktif" };
    const users = getStoredUsers();
    const currentHash = await hashPassword(currentPassword);
    const idx = users.findIndex(
      (u) => u.email.toLowerCase() === user.email.toLowerCase() && u.passwordHash === currentHash
    );
    if (idx === -1) {
      return { success: false, error: "Password saat ini salah" };
    }
    const newHash = await hashPassword(newPassword);
    users[idx].passwordHash = newHash;
    saveStoredUsers(users);
    return { success: true };
  }, []);

  const validateEmail = useCallback((email: string) => {
    return validateEmailFormat(email);
  }, []);

  const validatePassword = useCallback((password: string) => {
    const errors = getPasswordErrors(password);
    return { valid: errors.length === 0, errors };
  }, []);

  const value = { user: currentUser, isLoggedIn: !!currentUser, login, register, logout, updateUser, changePassword, validateEmail, validatePassword, version };

  return (
    <AuthContext.Provider value={value}>
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
