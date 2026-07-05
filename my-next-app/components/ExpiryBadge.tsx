"use client";

import { useExpiry, type ExpiryStatus } from "@/lib/expiry-context";

interface ExpiryBadgeProps {
  productId: number;
  expiryTime: string;
  bestBefore?: string;
  expiryDate?: string;
  compact?: boolean;
}

function getStatusStyles(status: ExpiryStatus): string {
  switch (status) {
    case "fresh":
      return "bg-green-100 text-green-800 border-green-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse";
    case "expired":
      return "bg-red-100 text-red-800 border-red-200";
  }
}

function getStatusIcon(status: ExpiryStatus): string {
  switch (status) {
    case "fresh":
      return "✅";
    case "warning":
      return "⚠️";
    case "expired":
      return "❌";
  }
}

export default function ExpiryBadge({ productId, expiryTime, bestBefore, expiryDate, compact = false }: ExpiryBadgeProps) {
  const { getExpiryInfo } = useExpiry();
  const info = getExpiryInfo(productId, expiryTime, bestBefore, expiryDate);

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusStyles(info.status)}`}>
        <span>{getStatusIcon(info.status)}</span>
        <span>{info.hoursRemaining > 0 ? `${Math.ceil(info.hoursRemaining)}j` : "Expired"}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusStyles(info.status)}`}>
      <span>{getStatusIcon(info.status)}</span>
      <span>{info.message}</span>
    </div>
  );
}
