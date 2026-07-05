"use client";

import { useStock, type StockLevel } from "@/lib/stock-context";

interface StockBarProps {
  productId: number;
  maxStock?: number;
}

function getBarColor(level: StockLevel): string {
  switch (level) {
    case "available":
      return "bg-green-500";
    case "low":
      return "bg-yellow-500";
    case "out":
      return "bg-red-500";
  }
}

function getBarBgColor(level: StockLevel): string {
  switch (level) {
    case "available":
      return "bg-green-100";
    case "low":
      return "bg-yellow-100";
    case "out":
      return "bg-red-100";
  }
}

export default function StockBar({ productId, maxStock = 50 }: StockBarProps) {
  const { getStock } = useStock();
  const stockInfo = getStock(productId);
  const percentage = Math.min(100, (stockInfo.quantity / maxStock) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">Stok</span>
        <span className={`font-medium ${stockInfo.level === "out" ? "text-red-600" : stockInfo.level === "low" ? "text-yellow-600" : "text-green-600"}`}>
          {stockInfo.quantity}/{maxStock}
        </span>
      </div>
      <div className={`h-2 rounded-full ${getBarBgColor(stockInfo.level)}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(stockInfo.level)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
