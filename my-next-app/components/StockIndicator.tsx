"use client";

import { useStock, type StockLevel } from "@/lib/stock-context";

interface StockIndicatorProps {
  productId: number;
  showDetails?: boolean;
}

function getLevelStyles(level: StockLevel): string {
  switch (level) {
    case "available":
      return "bg-green-100 text-green-800";
    case "low":
      return "bg-yellow-100 text-yellow-800";
    case "out":
      return "bg-red-100 text-red-800";
  }
}

function getLevelIcon(level: StockLevel): string {
  switch (level) {
    case "available":
      return "●";
    case "low":
      return "●";
    case "out":
      return "●";
  }
}

function getLevelColor(level: StockLevel): string {
  switch (level) {
    case "available":
      return "text-green-600";
    case "low":
      return "text-yellow-600";
    case "out":
      return "text-red-600";
  }
}

export default function StockIndicator({ productId, showDetails = false }: StockIndicatorProps) {
  const { getStock, getStockMessage } = useStock();
  const stockInfo = getStock(productId);
  const message = getStockMessage(productId);

  if (showDetails) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${getLevelStyles(stockInfo.level)}`}>
        <span className={`${getLevelColor(stockInfo.level)} animate-pulse`}>{getLevelIcon(stockInfo.level)}</span>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${getLevelColor(stockInfo.level)}`}>
      <span className="animate-pulse">{getLevelIcon(stockInfo.level)}</span>
      <span>{message}</span>
    </span>
  );
}
