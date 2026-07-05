"use client";

import { useState } from "react";
import { useProductPromo } from "@/lib/product-promo-context";
import Toast from "./Toast";

interface CouponInputProps {
  subtotal: number;
  onApply: (discount: number) => void;
}

export default function CouponInput({ subtotal, onApply }: CouponInputProps) {
  const { applyCoupon } = useProductPromo();
  const [code, setCode] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (!code.trim()) {
      setToast({ message: "Masukkan kode voucher", type: "error" });
      return;
    }

    const result = applyCoupon(code, subtotal);
    if (result.valid) {
      onApply(result.discount);
      setApplied(true);
      setToast({ message: result.message, type: "success" });
    } else {
      setToast({ message: result.message, type: "error" });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h4 className="font-bold text-gray-900 mb-3">Kode Voucher</h4>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Masukkan kode voucher"
          disabled={applied}
          className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition disabled:bg-gray-100 font-mono"
        />
        <button
          onClick={handleApply}
          disabled={applied || !code.trim()}
          className={`px-4 py-2.5 rounded-xl font-medium transition ${
            applied
              ? "bg-green-100 text-green-700"
              : "bg-green-700 text-white hover:bg-green-800 disabled:opacity-50"
          }`}
        >
          {applied ? "✓ Terpakai" : "Gunakan"}
        </button>
      </div>

      {/* Available Coupons */}
      <div className="mt-3 space-y-2">
        <p className="text-xs text-gray-500">Voucher tersedia:</p>
        <div className="flex flex-wrap gap-2">
          {["HEMAT15", "GRATISONGKIR", "FOODSAVER10", "NEWUSER"].map((coupon) => (
            <button
              key={coupon}
              onClick={() => !applied && setCode(coupon)}
              disabled={applied}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono hover:bg-gray-200 transition disabled:opacity-50"
            >
              {coupon}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
