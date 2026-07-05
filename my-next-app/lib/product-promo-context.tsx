"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type PromoType = "flash_sale" | "countdown" | "bundle" | "bogo" | "coupon";

export interface ProductPromotion {
  id: string;
  productId: number;
  productName: string;
  type: PromoType;
  title: string;
  description: string;
  discountPercent: number;
  originalPrice: number;
  promoPrice: number;
  couponCode?: string;
  minPurchase?: number;
  maxDiscount?: number;
  validUntil: string;
  stock?: number;
  soldCount?: number;
  bundleItems?: string[];
}

interface ProductPromoContextType {
  promotions: ProductPromotion[];
  getPromotionsByProduct: (productId: number) => ProductPromotion[];
  getPromotionsByType: (type: PromoType) => ProductPromotion[];
  getActivePromotions: () => ProductPromotion[];
  getFlashSales: () => ProductPromotion[];
  getCountdownDeals: () => ProductPromotion[];
  applyCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };
  usedCoupons: string[];
}

const ProductPromoContext = createContext<ProductPromoContextType | null>(null);

const promotions: ProductPromotion[] = [
  // Flash Sales
  {
    id: "pp1",
    productId: 1,
    productName: "Nasi Goreng Spesial",
    type: "flash_sale",
    title: "Flash Sale Nasi Goreng!",
    description: "Diskon spesial untuk 2 jam ke depan",
    discountPercent: 60,
    originalPrice: 35000,
    promoPrice: 14000,
    validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    stock: 20,
    soldCount: 12,
  },
  {
    id: "pp2",
    productId: 3,
    productName: "Kopi Americano",
    type: "flash_sale",
    title: "Flash Sale Kopi!",
    description: "Harga spesial untuk kopi favorit Anda",
    discountPercent: 50,
    originalPrice: 25000,
    promoPrice: 12500,
    validUntil: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    stock: 30,
    soldCount: 8,
  },
  // Countdown Deals
  {
    id: "pp3",
    productId: 5,
    productName: "Salad Segar",
    type: "countdown",
    title: "Deal Waktu Terbatas!",
    description: "Harga spesial berakhir dalam hitungan jam",
    discountPercent: 40,
    originalPrice: 22500,
    promoPrice: 13500,
    validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  },
  // Bundle Deals
  {
    id: "pp4",
    productId: 2,
    productName: "Roti Croissant",
    type: "bundle",
    title: "Paket Sarapan!",
    description: "Beli Roti Croissant + Kopi Americano lebih hemat",
    discountPercent: 25,
    originalPrice: 35000,
    promoPrice: 26250,
    bundleItems: ["Roti Croissant", "Kopi Americano"],
    validUntil: "2026-07-31",
  },
  // BOGO
  {
    id: "pp5",
    productId: 7,
    productName: "Jus Jeruk Segar",
    type: "bogo",
    title: "Beli 1 Gratis 1!",
    description: "Beli 1 Jus Jeruk, dapatkan 1 gratis",
    discountPercent: 50,
    originalPrice: 15000,
    promoPrice: 7500,
    validUntil: "2026-07-20",
    stock: 50,
    soldCount: 22,
  },
  // Coupons
  {
    id: "pp6",
    productId: 0, // applies to all
    productName: "Semua Produk",
    type: "coupon",
    title: "Voucher Diskon 15%!",
    description: "Gunakan kode untuk diskon 15% (min. belanja Rp30.000)",
    discountPercent: 15,
    originalPrice: 0,
    promoPrice: 0,
    couponCode: "HEMAT15",
    minPurchase: 30000,
    maxDiscount: 20000,
    validUntil: "2026-07-31",
  },
  {
    id: "pp7",
    productId: 0,
    productName: "Semua Produk",
    type: "coupon",
    title: "Voucher Gratis Ongkir!",
    description: "Gunakan kode untuk gratis ongkir (min. belanja Rp25.000)",
    discountPercent: 0,
    originalPrice: 0,
    promoPrice: 0,
    couponCode: "GRATISONGKIR",
    minPurchase: 25000,
    validUntil: "2026-07-31",
  },
];

function isPromotionValid(promo: ProductPromotion): boolean {
  return new Date(promo.validUntil) >= new Date();
}

const couponRewards: Record<string, { discount: number; message: string }> = {
  HEMAT15: { discount: 15, message: "Diskon 15% berhasil diterapkan!" },
  GRATISONGKIR: { discount: 5000, message: "Gratis ongkir diterapkan!" },
  FOODSAVER10: { discount: 10, message: "Diskon 10% berhasil diterapkan!" },
  NEWUSER: { discount: 20, message: "Diskon 20% untuk pengguna baru!" },
};

export function ProductPromoProvider({ children }: { children: ReactNode }) {
  const [usedCoupons, setUsedCoupons] = useState<string[]>([]);

  const getPromotionsByProduct = useCallback((productId: number) => {
    return promotions.filter(
      (p) => (p.productId === productId || p.productId === 0) && isPromotionValid(p)
    );
  }, []);

  const getPromotionsByType = useCallback((type: PromoType) => {
    return promotions.filter((p) => p.type === type && isPromotionValid(p));
  }, []);

  const getActivePromotions = useCallback(() => {
    return promotions.filter((p) => isPromotionValid(p));
  }, []);

  const getFlashSales = useCallback(() => {
    return promotions.filter((p) => p.type === "flash_sale" && isPromotionValid(p));
  }, []);

  const getCountdownDeals = useCallback(() => {
    return promotions.filter((p) => p.type === "countdown" && isPromotionValid(p));
  }, []);

  const applyCoupon = useCallback(
    (code: string, subtotal: number) => {
      const upperCode = code.toUpperCase().trim();
      const reward = couponRewards[upperCode];

      if (!reward) {
        return { valid: false, discount: 0, message: "Kode voucher tidak valid" };
      }

      if (usedCoupons.includes(upperCode)) {
        return { valid: false, discount: 0, message: "Kode voucher sudah digunakan" };
      }

      // Find coupon promo for min purchase check
      const couponPromo = promotions.find(
        (p) => p.type === "coupon" && p.couponCode?.toUpperCase() === upperCode
      );

      if (couponPromo?.minPurchase && subtotal < couponPromo.minPurchase) {
        return {
          valid: false,
          discount: 0,
          message: `Minimum pembelian Rp${couponPromo.minPurchase.toLocaleString("id-ID")}`,
        };
      }

      let discount = reward.discount;
      if (couponPromo?.maxDiscount && discount > couponPromo.maxDiscount) {
        discount = couponPromo.maxDiscount;
      }

      setUsedCoupons((prev) => [...prev, upperCode]);
      return { valid: true, discount, message: reward.message };
    },
    [usedCoupons]
  );

  return (
    <ProductPromoContext.Provider
      value={{
        promotions,
        getPromotionsByProduct,
        getPromotionsByType,
        getActivePromotions,
        getFlashSales,
        getCountdownDeals,
        applyCoupon,
        usedCoupons,
      }}
    >
      {children}
    </ProductPromoContext.Provider>
  );
}

export function useProductPromo() {
  const context = useContext(ProductPromoContext);
  if (!context) {
    throw new Error("useProductPromo must be used within a ProductPromoProvider");
  }
  return context;
}
