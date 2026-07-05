"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";

export interface TrustScore {
  productId: number;
  overall: number;
  breakdown: {
    rating: number;
    reviews: number;
    sales: number;
    seller: number;
    returnRate: number;
  };
  badges: TrustBadge[];
  verification: SellerVerification;
}

export interface TrustBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface SellerVerification {
  isVerified: boolean;
  verifiedSince?: string;
  responseTime: string;
  completionRate: number;
  location: string;
}

interface TrustScoreContextType {
  getTrustScore: (productId: number) => TrustScore;
  getSellerVerification: (shopId: string) => SellerVerification;
  getTrustLevel: (score: number) => "high" | "medium" | "low";
}

const TrustScoreContext = createContext<TrustScoreContextType | null>(null);

// Simulated trust data
const trustData: Record<number, Partial<TrustScore>> = {
  1: { overall: 92, breakdown: { rating: 95, reviews: 88, sales: 90, seller: 95, returnRate: 98 } },
  2: { overall: 88, breakdown: { rating: 90, reviews: 85, sales: 82, seller: 92, returnRate: 95 } },
  3: { overall: 85, breakdown: { rating: 88, reviews: 80, sales: 78, seller: 90, returnRate: 92 } },
  4: { overall: 90, breakdown: { rating: 92, reviews: 86, sales: 88, seller: 94, returnRate: 96 } },
  5: { overall: 87, breakdown: { rating: 89, reviews: 82, sales: 84, seller: 91, returnRate: 94 } },
};

const sellerData: Record<string, SellerVerification> = {
  "warung-bu-sari": {
    isVerified: true,
    verifiedSince: "2024-01-15",
    responseTime: "< 1 jam",
    completionRate: 98.5,
    location: "Jakarta Selatan",
  },
  "bakery-corner": {
    isVerified: true,
    verifiedSince: "2024-03-20",
    responseTime: "< 2 jam",
    completionRate: 97.2,
    location: "Jakarta Pusat",
  },
  "fresh-market": {
    isVerified: false,
    responseTime: "< 4 jam",
    completionRate: 95.8,
    location: "Jakarta Barat",
  },
};

function getTrustBadges(score: number): TrustBadge[] {
  const badges: TrustBadge[] = [];

  if (score >= 90) {
    badges.push({
      id: "top_seller",
      name: "Penjual Terpercaya",
      icon: "🏆",
      description: "Penjual dengan skor kepercayaan tertinggi",
      color: "bg-yellow-100 text-yellow-800",
    });
  }

  if (score >= 85) {
    badges.push({
      id: "fast_response",
      name: "Respon Cepat",
      icon: "⚡",
      description: "Penjual dengan waktu respon yang cepat",
      color: "bg-blue-100 text-blue-800",
    });
  }

  if (score >= 80) {
    badges.push({
      id: "high_quality",
      name: "Kualitas Terjamin",
      icon: "✅",
      description: "Produk dengan kualitas yang terjamin",
      color: "bg-green-100 text-green-800",
    });
  }

  return badges;
}

export function TrustScoreProvider({ children }: { children: ReactNode }) {
  const getTrustScore = useCallback((productId: number): TrustScore => {
    const data = trustData[productId] || { overall: 75, breakdown: { rating: 78, reviews: 72, sales: 70, seller: 80, returnRate: 85 } };
    const badges = getTrustBadges(data.overall || 75);

    return {
      productId,
      overall: data.overall || 75,
      breakdown: data.breakdown || { rating: 78, reviews: 72, sales: 70, seller: 80, returnRate: 85 },
      badges,
      verification: {
        isVerified: true,
        verifiedSince: "2024-01-15",
        responseTime: "< 1 jam",
        completionRate: 98.5,
        location: "Jakarta",
      },
    };
  }, []);

  const getSellerVerification = useCallback((shopId: string): SellerVerification => {
    return sellerData[shopId] || {
      isVerified: false,
      responseTime: "< 24 jam",
      completionRate: 90,
      location: "Indonesia",
    };
  }, []);

  const getTrustLevel = useCallback((score: number): "high" | "medium" | "low" => {
    if (score >= 85) return "high";
    if (score >= 70) return "medium";
    return "low";
  }, []);

  return (
    <TrustScoreContext.Provider value={{ getTrustScore, getSellerVerification, getTrustLevel }}>
      {children}
    </TrustScoreContext.Provider>
  );
}

export function useTrustScore() {
  const context = useContext(TrustScoreContext);
  if (!context) {
    throw new Error("useTrustScore must be used within a TrustScoreProvider");
  }
  return context;
}
