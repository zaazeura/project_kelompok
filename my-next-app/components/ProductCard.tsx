"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { formatRupiah } from "@/lib/format";
import type { Product } from "@/data/products";
import { useState } from "react";
import { TokopediaLogo, ShopeeLogo, LazadaLogo, TiktokShopLogo, BukalapakLogo, BlibliLogo, GrabFoodLogo, GoFoodLogo } from "./MarketplaceLogos";

const LOGO_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  "Tokopedia": TokopediaLogo,
  "Shopee": ShopeeLogo,
  "Lazada": LazadaLogo,
  "TikTok Shop": TiktokShopLogo,
  "Bukalapak": BukalapakLogo,
  "Blibli": BlibliLogo,
  "GrabFood": GrabFoodLogo,
  "GoFood": GoFoodLogo,
};

interface ProductCardProps {
  product: Product;
}

function getExpiryBadge(expiryTime: string) {
  const text = expiryTime.toLowerCase();
  if (text.includes("jam")) {
    const hours = parseInt(text);
    if (hours <= 2) return { label: "Hampir Habis!", color: "bg-red-500" };
    if (hours <= 6) return { label: "Sebentar Lagi", color: "bg-yellow-500" };
  }
  return null;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);
  const expiryBadge = getExpiryBadge(product.expiryTime);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link href={`/produk/${product.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <span className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
            -{product.discountPercent}%
          </span>
          {expiryBadge ? (
            <span className={`absolute top-3 right-12 px-2 py-1 ${expiryBadge.color} text-white text-xs rounded-full font-bold animate-pulse`}>
              ⚠ {expiryBadge.label}
            </span>
          ) : null}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition ${
              wishlisted ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-red-500"
            }`}
          >
            {wishlisted ? "♥" : "♡"}
          </button>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-full">Habis</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400">{product.distance}</span>
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
              {product.productType === "fresh" ? "Segar" : "Kemasan"}
            </span>
          </div>
          <div className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</div>
          <div className="text-xs text-gray-400 mb-1">📍 {product.location}</div>
          <div className={`text-xs font-medium mb-2 ${
            product.stock <= 0 ? "text-red-600" :
            product.stock <= 5 ? "text-red-500" :
            product.stock <= 15 ? "text-amber-600" :
            "text-green-600"
          }`}>
            {product.stock <= 0 ? "Stok habis" :
             product.stock <= 5 ? `Sisa ${product.stock}` :
             `Stok: ${product.stock}`}
          </div>
          {product.marketplaceLinks && product.marketplaceLinks.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-gray-400">Tersedia di:</span>
              <div className="flex gap-1 items-center">
                {product.marketplaceLinks.slice(0, 4).map((link) => {
                  const Logo = LOGO_MAP[link.name];
                  return Logo ? (
                    <Logo key={link.name} size={18} />
                  ) : (
                    <span key={link.name} className="text-xs bg-gray-200 px-1 rounded" title={link.name}>
                      {link.name.charAt(0)}
                    </span>
                  );
                })}
                {product.marketplaceLinks.length > 4 && (
                  <span className="text-xs text-gray-400">+{product.marketplaceLinks.length - 4}</span>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-400 line-through">{formatRupiah(product.originalPrice)}</span>
            <span className="text-lg font-bold text-orange-500">{formatRupiah(product.discountPrice)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition ${
                added
                  ? "bg-green-500 text-white"
                  : product.inStock
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {added ? "✓ Ditambahkan" : "Tambah ke Keranjang"}
            </button>
            <Link
              href={`/produk/${product.id}`}
              className="py-2 px-3 text-sm font-semibold rounded-xl border-2 border-green-700 text-green-700 hover:bg-green-50 transition"
              onClick={(e) => e.stopPropagation()}
            >
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}
