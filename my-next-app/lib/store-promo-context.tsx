"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface StorePromotion {
  id: string;
  shopId: string;
  shopName: string;
  type: "banner" | "voucher" | "cashback" | "loyalty";
  title: string;
  description: string;
  discount?: number;
  minPurchase?: number;
  maxDiscount?: number;
  code?: string;
  validUntil: string;
  image?: string;
  color: string;
}

interface StorePromoContextType {
  promotions: StorePromotion[];
  getPromotionsByShop: (shopId: string) => StorePromotion[];
  getPromotionsByType: (type: StorePromotion["type"]) => StorePromotion[];
  getActivePromotions: () => StorePromotion[];
  claimPromotion: (promoId: string) => void;
  claimedPromotions: string[];
  isClaimed: (promoId: string) => boolean;
}

const StorePromoContext = createContext<StorePromoContextType | null>(null);

const promotions: StorePromotion[] = [
  {
    id: "sp1",
    shopId: "warung-bu-sari",
    shopName: "Warung Bu Sari",
    type: "banner",
    title: "Diskon Spesial Weekend!",
    description: "Dapatkan diskon 20% untuk semua menu di akhir pekan",
    discount: 20,
    validUntil: "2026-07-31",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "sp2",
    shopId: "bakery-corner",
    shopName: "Bakery Corner",
    type: "voucher",
    title: "Voucher Roti Gratis",
    description: "Beli 2 roti dapat 1 gratis untuk roti dengan harga di bawah Rp15.000",
    code: "ROTIGRATIS",
    minPurchase: 20000,
    validUntil: "2026-07-15",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: "sp3",
    shopId: "fresh-market",
    shopName: "Fresh Market",
    type: "cashback",
    title: "Cashback 10%",
    description: "Dapatkan cashback 10% untuk pembelian minimal Rp50.000",
    discount: 10,
    minPurchase: 50000,
    maxDiscount: 15000,
    validUntil: "2026-07-20",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "sp4",
    shopId: "warung-bu-sari",
    shopName: "Warung Bu Sari",
    type: "loyalty",
    title: "Poin Loyalitas x2",
    description: "Dapatkan 2x poin loyalitas untuk setiap pembelian",
    validUntil: "2026-07-25",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "sp5",
    shopId: "bakery-corner",
    shopName: "Bakery Corner",
    type: "banner",
    title: "Paket Sarapan Hemat",
    description: "Paket sarapan lengkap hanya Rp25.000 (hemat Rp10.000!)",
    discount: 28,
    validUntil: "2026-07-10",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "sp6",
    shopId: "fresh-market",
    shopName: "Fresh Market",
    type: "voucher",
    title: "Voucher Gratis Ongkir",
    description: "Gratis ongkir untuk pembelian minimal Rp30.000",
    code: "GRATISONGKIR",
    minPurchase: 30000,
    validUntil: "2026-07-31",
    color: "from-teal-500 to-green-500",
  },
];

function isPromotionValid(promo: StorePromotion): boolean {
  return new Date(promo.validUntil) >= new Date();
}

export function StorePromoProvider({ children }: { children: ReactNode }) {
  const [claimedPromotions, setClaimedPromotions] = useState<string[]>([]);

  const getPromotionsByShop = useCallback((shopId: string) => {
    return promotions.filter((p) => p.shopId === shopId && isPromotionValid(p));
  }, []);

  const getPromotionsByType = useCallback((type: StorePromotion["type"]) => {
    return promotions.filter((p) => p.type === type && isPromotionValid(p));
  }, []);

  const getActivePromotions = useCallback(() => {
    return promotions.filter((p) => isPromotionValid(p));
  }, []);

  const claimPromotion = useCallback((promoId: string) => {
    setClaimedPromotions((prev) => [...prev, promoId]);
  }, []);

  const isClaimed = useCallback((promoId: string) => {
    return claimedPromotions.includes(promoId);
  }, [claimedPromotions]);

  return (
    <StorePromoContext.Provider
      value={{ promotions, getPromotionsByShop, getPromotionsByType, getActivePromotions, claimPromotion, claimedPromotions, isClaimed }}
    >
      {children}
    </StorePromoContext.Provider>
  );
}

export function useStorePromo() {
  const context = useContext(StorePromoContext);
  if (!context) {
    throw new Error("useStorePromo must be used within a StorePromoProvider");
  }
  return context;
}
