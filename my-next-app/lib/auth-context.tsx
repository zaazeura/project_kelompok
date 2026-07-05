"use client";

import { createContext, useContext, useCallback, useSyncExternalStore, useEffect, useRef, type ReactNode } from "react";

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
  locked?: boolean;
  lockMinutes?: number;
}

interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

interface SecurityEvent {
  type: "login" | "logout" | "password_change" | "lockout" | "session_timeout";
  timestamp: number;
  email?: string;
  details?: string;
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
  isLockedOut: (email: string) => boolean;
  getLockMinutesRemaining: (email: string) => number;
  getSecurityEvents: () => SecurityEvent[];
  getSessionTimeRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "foodsaver_users";
const SESSION_KEY = "foodsaver_session";
const LOGIN_ATTEMPTS_KEY = "foodsaver_login_attempts";
const SECURITY_EVENTS_KEY = "foodsaver_security_events";
const LAST_ACTIVITY_KEY = "foodsaver_last_activity";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_THROTTLE = 60 * 1000; // 1 minute

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
    if (!raw) return null;
    const user = JSON.parse(raw);
    // Check session timeout
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity);
      if (elapsed > SESSION_TIMEOUT) {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        return null;
      }
    }
    return user;
  } catch {
    return null;
  }
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } else {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }
}

function updateLastActivity() {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  const now = Date.now();
  if (!lastActivity || now - parseInt(lastActivity) > ACTIVITY_THROTTLE) {
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  }
}

function getLoginAttempts(): LoginAttempt[] {
  try {
    const raw = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLoginAttempt(attempt: LoginAttempt) {
  const attempts = getLoginAttempts();
  // Keep only last 20 attempts
  const filtered = attempts.slice(-19);
  filtered.push(attempt);
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(filtered));
}

function getFailedAttemptsForEmail(email: string): LoginAttempt[] {
  const attempts = getLoginAttempts();
  const cutoff = Date.now() - LOCKOUT_DURATION;
  return attempts.filter(
    (a) => a.email.toLowerCase() === email.toLowerCase() && !a.success && a.timestamp > cutoff
  );
}

function getSecurityEvents(): SecurityEvent[] {
  try {
    const raw = localStorage.getItem(SECURITY_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addSecurityEvent(event: Omit<SecurityEvent, "timestamp">) {
  const events = getSecurityEvents();
  const newEvent = { ...event, timestamp: Date.now() };
  // Keep last 50 events
  const filtered = events.slice(-49);
  filtered.push(newEvent);
  localStorage.setItem(SECURITY_EVENTS_KEY, JSON.stringify(filtered));
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
  const lastActivityRef = useRef<number>(Date.now());

  // Session timeout monitor
  useEffect(() => {
    if (!currentUser) return;

    const checkSession = () => {
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity);
        if (elapsed > SESSION_TIMEOUT) {
          addSecurityEvent({ type: "session_timeout", email: currentUser.email });
          saveSession(null);
          emitChange();
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60 * 1000);

    // Track user activity
    const handleActivity = () => {
      if (currentUser) {
        updateLastActivity();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [currentUser]);

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check lockout
    const failedAttempts = getFailedAttemptsForEmail(trimmedEmail);
    if (failedAttempts.length >= MAX_LOGIN_ATTEMPTS) {
      const oldestFailed = failedAttempts[0];
      const lockExpiry = oldestFailed.timestamp + LOCKOUT_DURATION;
      const minutesRemaining = Math.ceil((lockExpiry - Date.now()) / 60000);
      addSecurityEvent({ type: "lockout", email: trimmedEmail, details: `Locked for ${minutesRemaining} min` });
      return { success: false, error: `Akun terkunci. Coba lagi dalam ${minutesRemaining} menit.`, locked: true, lockMinutes: minutesRemaining };
    }

    const users = getStoredUsers();
    const passwordHash = await hashPassword(password);
    const found = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.passwordHash === passwordHash
    );

    if (!found) {
      saveLoginAttempt({ email: trimmedEmail, timestamp: Date.now(), success: false });
      const remaining = MAX_LOGIN_ATTEMPTS - failedAttempts.length - 1;
      addSecurityEvent({ type: "login", email: trimmedEmail, details: `Failed. ${remaining} attempts remaining` });
      return { success: false, error: remaining > 0 ? `Email atau password salah. Sisa percobaan: ${remaining}` : "Email atau password salah. Akun terkunci selama 15 menit." };
    }

    const userData: User = {
      name: found.name,
      email: found.email,
      phone: found.phone,
      address: found.address,
    };
    saveSession(userData);
    saveLoginAttempt({ email: trimmedEmail, timestamp: Date.now(), success: true });
    addSecurityEvent({ type: "login", email: trimmedEmail, details: "Success" });
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
    addSecurityEvent({ type: "login", email: trimmedEmail, details: "Registered" });
    emitChange();
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    const user = getSession();
    if (user) {
      addSecurityEvent({ type: "logout", email: user.email });
    }
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
      addSecurityEvent({ type: "password_change", email: user.email, details: "Failed - wrong current password" });
      return { success: false, error: "Password saat ini salah" };
    }
    const newHash = await hashPassword(newPassword);
    users[idx].passwordHash = newHash;
    saveStoredUsers(users);
    addSecurityEvent({ type: "password_change", email: user.email, details: "Success" });
    return { success: true };
  }, []);

  const validateEmail = useCallback((email: string) => {
    return validateEmailFormat(email);
  }, []);

  const validatePassword = useCallback((password: string) => {
    const errors = getPasswordErrors(password);
    return { valid: errors.length === 0, errors };
  }, []);

  const isLockedOut = useCallback((email: string) => {
    const failedAttempts = getFailedAttemptsForEmail(email);
    return failedAttempts.length >= MAX_LOGIN_ATTEMPTS;
  }, []);

  const getLockMinutesRemaining = useCallback((email: string) => {
    const failedAttempts = getFailedAttemptsForEmail(email);
    if (failedAttempts.length < MAX_LOGIN_ATTEMPTS) return 0;
    const oldestFailed = failedAttempts[0];
    const lockExpiry = oldestFailed.timestamp + LOCKOUT_DURATION;
    return Math.max(0, Math.ceil((lockExpiry - Date.now()) / 60000));
  }, []);

  const getSecurityEventsList = useCallback(() => {
    return getSecurityEvents();
  }, []);

  const getSessionTimeRemaining = useCallback(() => {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) return SESSION_TIMEOUT;
    const elapsed = Date.now() - parseInt(lastActivity);
    return Math.max(0, SESSION_TIMEOUT - elapsed);
  }, []);

  const value = {
    user: currentUser,
    isLoggedIn: !!currentUser,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    validateEmail,
    validatePassword,
    isLockedOut,
    getLockMinutesRemaining,
    getSecurityEvents: getSecurityEventsList,
    getSessionTimeRemaining,
    version,
  };

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
