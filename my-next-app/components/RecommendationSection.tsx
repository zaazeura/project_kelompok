"use client";

import { useRecommendation } from "@/lib/recommendation-context";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

interface RecommendationSectionProps {
  title: string;
  type: "similar" | "recently_viewed" | "trending" | "for_you";
  productId?: number;
  limit?: number;
}

export default function RecommendationSection({ title, type, productId, limit = 6 }: RecommendationSectionProps) {
  const { getSimilarProducts, getRecentlyViewed, getTrendingProducts, getRecommendedForYou } = useRecommendation();

  let products: ReturnType<typeof getSimilarProducts> = [];

  switch (type) {
    case "similar":
      if (productId) products = getSimilarProducts(productId, limit);
      break;
    case "recently_viewed":
      products = getRecentlyViewed(limit);
      break;
    case "trending":
      products = getTrendingProducts(limit);
      break;
    case "for_you":
      products = getRecommendedForYou(limit);
      break;
  }

  if (products.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link href="/produk" className="text-green-700 font-medium text-sm hover:underline">
          Lihat Semua →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/produk/${product.id}`}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {product.discountPercent > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-green-700 transition">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.location}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-bold text-green-700">{formatRupiah(product.discountPrice)}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-yellow-500">⭐ {product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount})</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
