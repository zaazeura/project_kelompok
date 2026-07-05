"use client";

import { useExpiry } from "@/lib/expiry-context";
import { products } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

export default function ExpiryAlert() {
  const { getExpiryInfo, dismissAlert, isAlertDismissed } = useExpiry();

  const expiringProducts = products
    .filter((p) => p.productType === "fresh" && p.bestBefore)
    .map((p) => ({
      product: p,
      info: getExpiryInfo(p.id, p.expiryTime, p.bestBefore, p.expiryDate),
    }))
    .filter((item) => item.info.status === "warning" && !isAlertDismissed(item.product.id))
    .slice(0, 3);

  if (expiringProducts.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">⏰</span>
        <h3 className="font-bold text-yellow-800">Produk Hampir Kedaluwarsa</h3>
      </div>
      <div className="space-y-3">
        {expiringProducts.map(({ product, info }) => (
          <div key={product.id} className="flex items-center gap-3 bg-white rounded-xl p-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <Link href={`/produk/${product.id}`} className="font-medium text-gray-900 hover:text-green-700 line-clamp-1">
                {product.name}
              </Link>
              <p className="text-sm text-yellow-600 font-medium">{info.message}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-700">{formatRupiah(product.discountPrice)}</p>
              <button
                onClick={() => dismissAlert(product.id)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Sembunyikan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
