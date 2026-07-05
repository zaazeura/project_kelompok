"use client";

import { useState, useEffect } from "react";
import { useProductPromo, type ProductPromotion } from "@/lib/product-promo-context";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

interface FlashSaleProps {
  limit?: number;
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1">
      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
        {timeLeft.hours.toString().padStart(2, "0")}
      </span>
      <span className="text-red-600 font-bold">:</span>
      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
        {timeLeft.minutes.toString().padStart(2, "0")}
      </span>
      <span className="text-red-600 font-bold">:</span>
      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
        {timeLeft.seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}

export default function FlashSale({ limit = 4 }: FlashSaleProps) {
  const { getFlashSales } = useProductPromo();
  const flashSales = getFlashSales().slice(0, limit);

  if (flashSales.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Flash Sale</h2>
          <span className="text-2xl">⚡</span>
        </div>
        <Link href="/produk" className="text-green-700 font-medium text-sm hover:underline">
          Lihat Semua →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashSales.map((promo) => (
          <Link
            key={promo.id}
            href={`/produk/${promo.productId}`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
          >
            {/* Discount Badge */}
            <div className="relative h-40 bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-4xl font-bold">{promo.discountPercent}%</p>
                <p className="text-sm opacity-90">OFF</p>
              </div>
              {promo.stock && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/30 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${((promo.soldCount || 0) / promo.stock) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-white text-center mt-1">
                    {promo.soldCount}/{promo.stock} terjual
                  </p>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-green-700 transition">
                {promo.productName}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{promo.description}</p>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-lg font-bold text-red-600">{formatRupiah(promo.promoPrice)}</span>
                <span className="text-sm text-gray-400 line-through">{formatRupiah(promo.originalPrice)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">Berakhir dalam:</span>
                <CountdownTimer endDate={promo.validUntil} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
