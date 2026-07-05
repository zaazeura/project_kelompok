"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

interface NotifContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotifContext = createContext<NotifContextType | null>(null);

const initialNotifications: Notification[] = [
  { id: 1, title: "Produk Favorit Diskon!", message: "Nasi Goreng Spesial sedang diskon 50%. Buruan sebelum habis!", time: "5 menit lalu", read: false, icon: "🔥" },
  { id: 2, title: "Pesanan Selesai", message: "Pesanan #1 Anda sudah selesai. Terima kasih!", time: "2 jam lalu", read: false, icon: "✅" },
  { id: 3, title: "Donasi Berhasil", message: "Donasi Rp 50.000 Anda untuk program Donasi Makanan berhasil dikirim.", time: "1 hari lalu", read: true, icon: "🎁" },
  { id: 4, title: "Selamat Datang!", message: "Selamat datang di EarthShop! Mulai belanja ramah lingkungan sekarang.", time: "2 hari lalu", read: true, icon: "🌍" },
];

export function NotifProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, markAsRead, markAllRead, clearAll }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotifProvider");
  }
  return context;
}
