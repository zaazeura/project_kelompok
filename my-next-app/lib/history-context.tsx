"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface HistoryItem {
  name: string;
  qty: number;
  price: number;
}

export interface HistoryOrder {
  id: number;
  date: string;
  items: HistoryItem[];
  total: number;
  status: string;
  co2Saved: string;
  delivery: string;
}

interface HistoryContextType {
  orders: HistoryOrder[];
  addOrder: (order: Omit<HistoryOrder, "id" | "date" | "status" | "co2Saved">) => void;
  totalSpent: number;
  totalOrders: number;
  totalCO2: string;
}

const HistoryContext = createContext<HistoryContextType | null>(null);

const initialOrders: HistoryOrder[] = [
  {
    id: 1,
    date: "3 Juli 2026",
    items: [
      { name: "Nasi Goreng Spesial", qty: 2, price: 17500 },
      { name: "Kopi Americano", qty: 1, price: 15000 },
    ],
    total: 50000,
    status: "Selesai",
    co2Saved: "1.2 kg",
    delivery: "delivery",
  },
  {
    id: 2,
    date: "28 Juni 2026",
    items: [
      { name: "Roti Croissant", qty: 3, price: 10000 },
      { name: "Salad Segar", qty: 1, price: 22500 },
    ],
    total: 52500,
    status: "Selesai",
    co2Saved: "0.8 kg",
    delivery: "pickup",
  },
];

function randomCO2(total: number): string {
  const kg = (total / 10000 * 0.5 + Math.random() * 1.5).toFixed(1);
  return `${kg} kg`;
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<HistoryOrder[]>(initialOrders);

  const addOrder = useCallback((order: Omit<HistoryOrder, "id" | "date" | "status" | "co2Saved">) => {
    const now = new Date();
    const newOrder: HistoryOrder = {
      ...order,
      id: orders.length + 1,
      date: now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: "Selesai",
      co2Saved: randomCO2(order.total),
    };
    setOrders((prev) => [newOrder, ...prev]);
  }, [orders.length]);

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalCO2 = `${orders.reduce((sum, o) => sum + parseFloat(o.co2Saved), 0).toFixed(1)} kg`;

  return (
    <HistoryContext.Provider value={{ orders, addOrder, totalSpent, totalOrders, totalCO2 }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
