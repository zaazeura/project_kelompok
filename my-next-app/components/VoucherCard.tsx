"use client";

import { useState } from "react";
import { useStorePromo, type StorePromotion } from "@/lib/store-promo-context";
import { formatRupiah } from "@/lib/format";
import Toast from "./Toast";

interface VoucherCardProps {
  promotion: StorePromotion;
}

export default function VoucherCard({ promotion }: VoucherCardProps) {
  const { claimPromotion, isClaimed } = useStorePromo();
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const claimed = isClaimed(promotion.id);

  const handleClaim = () => {
    claimPromotion(promotion.id);
    setToast("Voucher berhasil diklaim!");
  };

  const handleCopyCode = () => {
    if (promotion.code) {
      navigator.clipboard.writeText(promotion.code);
      setCopied(true);
      setToast("Kode voucher disalin!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${claimed ? "border-green-200 bg-green-50" : "border-gray-100"}`}>
      <div className="flex items-start gap-3">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
          promotion.type === "voucher" ? "bg-orange-100" :
          promotion.type === "cashback" ? "bg-green-100" :
          promotion.type === "loyalty" ? "bg-purple-100" :
          "bg-blue-100"
        }`}>
          {promotion.type === "voucher" ? "🎫" :
           promotion.type === "cashback" ? "💰" :
           promotion.type === "loyalty" ? "⭐" : "🏷️"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{promotion.title}</h4>
            {claimed && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                Diklaim
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{promotion.description}</p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{promotion.shopName}</span>
            <span>•</span>
            <span>Min. {promotion.minPurchase ? formatRupiah(promotion.minPurchase) : "-"}</span>
          </div>

          {promotion.discount && (
            <div className="mt-2">
              <span className="text-lg font-bold text-green-700">
                {promotion.type === "cashback" ? `Cashback ${promotion.discount}%` : `Diskon ${promotion.discount}%`}
              </span>
              {promotion.maxDiscount && (
                <span className="text-xs text-gray-500 ml-1">(maks. {formatRupiah(promotion.maxDiscount)})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Code & Actions */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        {promotion.code ? (
          <div className="flex items-center gap-2">
            <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm text-center">
              {promotion.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition"
            >
              {copied ? "✓" : "Salin"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={claimed}
            className={`w-full py-2 rounded-lg text-sm font-medium transition ${
              claimed
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800"
            }`}
          >
            {claimed ? "✓ Sudah Diklaim" : "Klaim Voucher"}
          </button>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-400 text-center">
        Berlaku hingga {new Date(promotion.validUntil).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
      </div>

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
}
