"use client";

import { useStorePromo, type StorePromotion } from "@/lib/store-promo-context";

interface PromoBannerProps {
  shopId?: string;
}

function getTypeIcon(type: StorePromotion["type"]): string {
  switch (type) {
    case "banner": return "🏷️";
    case "voucher": return "🎫";
    case "cashback": return "💰";
    case "loyalty": return "⭐";
  }
}

function getTypeLabel(type: StorePromotion["type"]): string {
  switch (type) {
    case "banner": return "Promo";
    case "voucher": return "Voucher";
    case "cashback": return "Cashback";
    case "loyalty": return "Loyalitas";
  }
}

export default function PromoBanner({ shopId }: PromoBannerProps) {
  const { getPromotionsByShop, getActivePromotions, claimPromotion, isClaimed } = useStorePromo();

  const promos = shopId ? getPromotionsByShop(shopId) : getActivePromotions();
  const banners = promos.filter((p) => p.type === "banner");

  if (banners.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {banners.map((promo) => (
        <div
          key={promo.id}
          className={`bg-gradient-to-r ${promo.color} rounded-2xl p-6 text-white relative overflow-hidden`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white rounded-full" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">
                  {getTypeIcon(promo.type)} {getTypeLabel(promo.type)}
                </span>
                <h3 className="text-xl font-bold">{promo.title}</h3>
              </div>
              {promo.discount && (
                <div className="text-right">
                  <span className="text-3xl font-bold">{promo.discount}%</span>
                  <span className="text-sm block">OFF</span>
                </div>
              )}
            </div>

            <p className="text-white/90 text-sm mb-3">{promo.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">Berlaku hingga {new Date(promo.validUntil).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="text-xs text-white/70">• {promo.shopName}</span>
            </div>

            {promo.code && (
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-lg font-mono text-sm">
                  {promo.code}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
