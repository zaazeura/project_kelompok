"use client";

import { useEffect, useState } from "react";
import { useStockSync } from "@/lib/stock-sync-context";

interface StockSyncIndicatorProps {
  productId: number;
}

export default function StockSyncIndicator({ productId }: StockSyncIndicatorProps) {
  const { getStock, subscribeToStock, isLowStock, isOutOfStock } = useStockSync();
  const [stock, setStock] = useState(getStock(productId));
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setStock(getStock(productId));

    const unsubscribe = subscribeToStock(productId, (newQuantity) => {
      setStock(newQuantity);
      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
    });

    return unsubscribe;
  }, [productId, getStock, subscribeToStock]);

  const getStatus = () => {
    if (stock <= 0) return { label: "Habis", color: "text-red-600", bg: "bg-red-100" };
    if (stock <= 3) return { label: `Sisa ${stock}!`, color: "text-red-600", bg: "bg-red-100" };
    if (stock <= 5) return { label: `Stok rendah (${stock})`, color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: `Tersedia (${stock})`, color: "text-green-600", bg: "bg-green-100" };
  };

  const status = getStatus();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${status.bg} ${status.color} ${
        flash ? "scale-110 ring-2 ring-green-400" : ""
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        stock <= 0 ? "bg-red-500" : stock <= 5 ? "bg-yellow-500 animate-pulse" : "bg-green-500"
      }`} />
      <span>{status.label}</span>
      {flash && <span className="text-[10px] opacity-70">↻</span>}
    </div>
  );
}
