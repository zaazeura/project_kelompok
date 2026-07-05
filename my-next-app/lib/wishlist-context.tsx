"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product } from "@/data/products";

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: number) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const toggleWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => items.some((p) => p.id === productId),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
