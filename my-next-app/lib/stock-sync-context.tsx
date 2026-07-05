"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface StockUpdate {
  productId: number;
  oldQuantity: number;
  newQuantity: number;
  timestamp: string;
  source: "cart" | "checkout" | "external";
}

interface StockSyncContextType {
  stockData: Record<number, number>;
  getStock: (productId: number) => number;
  updateStock: (productId: number, quantity: number, source?: "cart" | "checkout" | "external") => void;
  subscribeToStock: (productId: number, callback: (quantity: number) => void) => () => void;
  recentUpdates: StockUpdate[];
  isLowStock: (productId: number) => boolean;
  isOutOfStock: (productId: number) => boolean;
}

const StockSyncContext = createContext<StockSyncContextType | null>(null);

const STOCK_KEY = "foodsaver_stock_sync";

// Initial stock data
const initialStock: Record<number, number> = {
  1: 25, 2: 18, 3: 12, 4: 30, 5: 8,
  6: 15, 7: 22, 8: 5, 9: 20, 10: 10,
  11: 35, 12: 14, 13: 28, 14: 7, 15: 19,
  16: 24, 17: 11, 18: 32, 19: 9, 20: 16,
  21: 21, 22: 6, 23: 27, 24: 13, 25: 23,
};

function loadStock(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STOCK_KEY);
    return raw ? JSON.parse(raw) : initialStock;
  } catch {
    return initialStock;
  }
}

function saveStock(stock: Record<number, number>) {
  localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
}

// Event system for cross-tab synchronization
const stockListeners = new Map<number, Set<(quantity: number) => void>>();

export function StockSyncProvider({ children }: { children: ReactNode }) {
  const [stockData, setStockData] = useState<Record<number, number>>(initialStock);
  const [recentUpdates, setRecentUpdates] = useState<StockUpdate[]>([]);

  // Load stock from localStorage on mount
  useEffect(() => {
    const stored = loadStock();
    setStockData(stored);
  }, []);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STOCK_KEY && e.newValue) {
        try {
          const newStock = JSON.parse(e.newValue);
          setStockData(newStock);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getStock = useCallback((productId: number): number => {
    return stockData[productId] || 0;
  }, [stockData]);

  const updateStock = useCallback(
    (productId: number, quantity: number, source: "cart" | "checkout" | "external" = "external") => {
      setStockData((prev) => {
        const oldQuantity = prev[productId] || 0;
        const newQuantity = Math.max(0, quantity);

        if (oldQuantity === newQuantity) return prev;

        const update: StockUpdate = {
          productId,
          oldQuantity,
          newQuantity,
          timestamp: new Date().toISOString(),
          source,
        };

        setRecentUpdates((updates) => [...updates.slice(-19), update]);

        // Notify subscribers
        const listeners = stockListeners.get(productId);
        if (listeners) {
          listeners.forEach((callback) => callback(newQuantity));
        }

        const newStock = { ...prev, [productId]: newQuantity };
        saveStock(newStock);
        return newStock;
      });
    },
    []
  );

  const subscribeToStock = useCallback((productId: number, callback: (quantity: number) => void) => {
    if (!stockListeners.has(productId)) {
      stockListeners.set(productId, new Set());
    }
    stockListeners.get(productId)!.add(callback);

    return () => {
      const listeners = stockListeners.get(productId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          stockListeners.delete(productId);
        }
      }
    };
  }, []);

  const isLowStock = useCallback((productId: number): boolean => {
    const stock = stockData[productId] || 0;
    return stock > 0 && stock <= 5;
  }, [stockData]);

  const isOutOfStock = useCallback((productId: number): boolean => {
    return (stockData[productId] || 0) <= 0;
  }, [stockData]);

  // Simulate external stock changes every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const productIds = Object.keys(stockData).map(Number);
      const randomId = productIds[Math.floor(Math.random() * productIds.length)];
      const change = Math.floor(Math.random() * 3) - 1;

      if (change !== 0) {
        const currentStock = stockData[randomId] || 0;
        const newStock = Math.max(0, Math.min(50, currentStock + change));
        updateStock(randomId, newStock, "external");
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [stockData, updateStock]);

  return (
    <StockSyncContext.Provider
      value={{ stockData, getStock, updateStock, subscribeToStock, recentUpdates, isLowStock, isOutOfStock }}
    >
      {children}
    </StockSyncContext.Provider>
  );
}

export function useStockSync() {
  const context = useContext(StockSyncContext);
  if (!context) {
    throw new Error("useStockSync must be used within a StockSyncProvider");
  }
  return context;
}
