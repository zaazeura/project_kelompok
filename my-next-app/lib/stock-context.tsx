"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type StockLevel = "available" | "low" | "out";

interface StockInfo {
  productId: number;
  quantity: number;
  level: StockLevel;
  maxPerOrder: number;
  lastUpdated: string;
}

interface StockContextType {
  getStock: (productId: number) => StockInfo;
  updateStock: (productId: number, quantity: number) => void;
  canAddToCart: (productId: number, currentQty: number, requestedQty: number) => boolean;
  getStockMessage: (productId: number) => string;
  stockChanges: StockChange[];
}

interface StockChange {
  productId: number;
  oldQuantity: number;
  newQuantity: number;
  timestamp: string;
}

const StockContext = createContext<StockContextType | null>(null);

// Simulated initial stock data
const initialStock: Record<number, number> = {
  1: 25, 2: 18, 3: 12, 4: 30, 5: 8,
  6: 15, 7: 22, 8: 5, 9: 20, 10: 10,
  11: 35, 12: 14, 13: 28, 14: 7, 15: 19,
  16: 24, 17: 11, 18: 32, 19: 9, 20: 16,
  21: 21, 22: 6, 23: 27, 24: 13, 25: 23,
};

function getStockLevel(quantity: number): StockLevel {
  if (quantity <= 0) return "out";
  if (quantity <= 5) return "low";
  return "available";
}

function getMaxPerOrder(quantity: number): number {
  if (quantity <= 0) return 0;
  if (quantity <= 3) return quantity;
  if (quantity <= 10) return Math.min(5, quantity);
  return Math.min(10, quantity);
}

export function StockProvider({ children }: { children: ReactNode }) {
  const [stock, setStock] = useState<Record<number, number>>(initialStock);
  const [stockChanges, setStockChanges] = useState<StockChange[]>([]);

  // Simulate random stock changes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const productIds = Object.keys(stock).map(Number);
      const randomId = productIds[Math.floor(Math.random() * productIds.length)];
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1

      setStock((prev) => {
        const oldQty = prev[randomId] || 0;
        const newQty = Math.max(0, Math.min(50, oldQty + change));

        if (oldQty !== newQty) {
          setStockChanges((changes) => [
            ...changes.slice(-19),
            {
              productId: randomId,
              oldQuantity: oldQty,
              newQuantity: newQty,
              timestamp: new Date().toISOString(),
            },
          ]);
        }

        return { ...prev, [randomId]: newQty };
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [stock]);

  const getStock = useCallback(
    (productId: number): StockInfo => {
      const quantity = stock[productId] || 0;
      return {
        productId,
        quantity,
        level: getStockLevel(quantity),
        maxPerOrder: getMaxPerOrder(quantity),
        lastUpdated: new Date().toISOString(),
      };
    },
    [stock]
  );

  const updateStock = useCallback((productId: number, quantity: number) => {
    setStock((prev) => {
      const oldQty = prev[productId] || 0;
      const newQty = Math.max(0, quantity);
      setStockChanges((changes) => [
        ...changes.slice(-19),
        {
          productId,
          oldQuantity: oldQty,
          newQuantity: newQty,
          timestamp: new Date().toISOString(),
        },
      ]);
      return { ...prev, [productId]: newQty };
    });
  }, []);

  const canAddToCart = useCallback(
    (productId: number, currentQty: number, requestedQty: number): boolean => {
      const quantity = stock[productId] || 0;
      const available = quantity - currentQty;
      return requestedQty <= available && requestedQty > 0;
    },
    [stock]
  );

  const getStockMessage = useCallback(
    (productId: number): string => {
      const quantity = stock[productId] || 0;
      if (quantity <= 0) return "Stok habis";
      if (quantity <= 3) return `Sisa ${quantity} lagi!`;
      if (quantity <= 5) return `Stok terbatas (${quantity})`;
      return `Tersedia (${quantity})`;
    },
    [stock]
  );

  return (
    <StockContext.Provider value={{ getStock, updateStock, canAddToCart, getStockMessage, stockChanges }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
}
