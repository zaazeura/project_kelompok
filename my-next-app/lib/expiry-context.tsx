"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type ExpiryStatus = "fresh" | "warning" | "expired";

export interface ExpiryInfo {
  productId: number;
  status: ExpiryStatus;
  hoursRemaining: number;
  message: string;
  bestBefore?: string;
  expiryDate?: string;
}

interface ExpiryContextType {
  getExpiryInfo: (productId: number, expiryTime: string, bestBefore?: string, expiryDate?: string) => ExpiryInfo;
  getExpiringProducts: () => ExpiryInfo[];
  dismissedAlerts: number[];
  dismissAlert: (productId: number) => void;
  isAlertDismissed: (productId: number) => boolean;
}

const ExpiryContext = createContext<ExpiryContextType | null>(null);

const DISMISSED_KEY = "foodsaver_dismissed_alerts";

function parseExpiryTime(expiryTime: string): number {
  const match = expiryTime.match(/(\d+)\s*(jam|menit|hari|hour|minute|day)/i);
  if (!match) return 0;
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === "jam" || unit === "hour") return value * 60 * 60 * 1000;
  if (unit === "menit" || unit === "minute") return value * 60 * 1000;
  if (unit === "hari" || unit === "day") return value * 24 * 60 * 60 * 1000;
  return 0;
}

function calculateExpiryStatus(hoursRemaining: number): ExpiryStatus {
  if (hoursRemaining <= 0) return "expired";
  if (hoursRemaining <= 2) return "warning";
  return "fresh";
}

function getExpiryMessage(status: ExpiryStatus, hoursRemaining: number): string {
  if (status === "expired") return "Produk sudah kedaluwarsa";
  if (status === "warning") {
    if (hoursRemaining <= 1) return `Kurang dari 1 jam lagi`;
    return `Kurang dari ${Math.ceil(hoursRemaining)} jam lagi`;
  }
  if (hoursRemaining <= 6) return `Masih ${Math.ceil(hoursRemaining)} jam`;
  return `Masih segar`;
}

function getDismissedAlerts(): number[] {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDismissedAlerts(ids: number[]) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
}

export function ExpiryProvider({ children }: { children: ReactNode }) {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  useEffect(() => {
    setDismissedAlerts(getDismissedAlerts());
  }, []);

  const getExpiryInfo = useCallback(
    (productId: number, expiryTime: string, bestBefore?: string, expiryDate?: string): ExpiryInfo => {
      const now = Date.now();
      let expiryMs = 0;
      let expiryDateStr: string | undefined;

      if (bestBefore) {
        expiryMs = new Date(bestBefore).getTime() - now;
        expiryDateStr = bestBefore;
      } else if (expiryDate) {
        expiryMs = new Date(expiryDate).getTime() - now;
        expiryDateStr = expiryDate;
      } else {
        expiryMs = parseExpiryTime(expiryTime);
        // For relative times, we can't calculate exact hours without a start time
        // Use a default of 4 hours for fresh items
        const totalHours = expiryMs / (60 * 60 * 1000);
        const hoursRemaining = Math.max(0, totalHours - 2); // Assume 2 hours have passed
        const status = calculateExpiryStatus(hoursRemaining);
        return {
          productId,
          status,
          hoursRemaining,
          message: getExpiryMessage(status, hoursRemaining),
        };
      }

      const hoursRemaining = Math.max(0, expiryMs / (60 * 60 * 1000));
      const status = calculateExpiryStatus(hoursRemaining);

      return {
        productId,
        status,
        hoursRemaining,
        message: getExpiryMessage(status, hoursRemaining),
        bestBefore,
        expiryDate: expiryDateStr,
      };
    },
    []
  );

  const getExpiringProducts = useCallback((): ExpiryInfo[] => {
    // This would need product data to work properly
    // For now, return empty array
    return [];
  }, []);

  const dismissAlert = useCallback((productId: number) => {
    setDismissedAlerts((prev) => {
      const updated = [...prev, productId];
      saveDismissedAlerts(updated);
      return updated;
    });
  }, []);

  const isAlertDismissed = useCallback(
    (productId: number) => dismissedAlerts.includes(productId),
    [dismissedAlerts]
  );

  return (
    <ExpiryContext.Provider
      value={{ getExpiryInfo, getExpiringProducts, dismissedAlerts, dismissAlert, isAlertDismissed }}
    >
      {children}
    </ExpiryContext.Provider>
  );
}

export function useExpiry() {
  const context = useContext(ExpiryContext);
  if (!context) {
    throw new Error("useExpiry must be used within an ExpiryProvider");
  }
  return context;
}
