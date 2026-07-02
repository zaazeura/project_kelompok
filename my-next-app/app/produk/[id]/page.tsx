"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuantitySelector from "@/components/QuantitySelector";
import Toast from "@/components/Toast";
import { getProductById, getProductsByCategory } from "@/data/products";
import { getShopById } from "@/data/shops";
import { useCart } from "@/lib/cart-context";
import { formatRupiah, formatDateTime, isFreshProductStillGood } from "@/lib/format";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const productId = Number(params.id);
  const product = getProductById(productId);
  const shop = product ? getShopById(product.shopId) : null;
  const relatedProducts = product
    ? getProductsByCategory(product.categorySlug).filter((p) => p.id !== product.id).slice(0, 3)
    : [];

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 max-w-6xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Produk yang Anda cari tidak tersedia.</p>
          <Link href="/produk" className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
            Lihat Semua Produk
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setToast(`${product.name} ditambahkan ke keranjang!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/keranjang");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700 transition">Beranda</Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-green-700 transition">Produk</Link>
          <span>/</span>
          <Link href={`/kategori/${product.categorySlug}`} className="hover:text-green-700 transition">
            {product.categorySlug.replace("-", " & ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-3">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === i ? "border-green-700" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                  -{product.discountPercent}%
                </span>
                <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                  ⏱ {product.expiryTime}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} ulasan)</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-400 line-through">{formatRupiah(product.originalPrice)}</span>
                <span className="text-3xl font-bold text-orange-500">{formatRupiah(product.discountPrice)}</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">{product.description}</p>

              {/* Date Info */}
              {product.productType === "fresh" && product.productionTime && product.bestBefore && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-amber-800 mb-2 text-sm">📦 Informasi Ketersediaan</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dibuat</span>
                      <span className="text-gray-900 font-medium">{formatDateTime(product.productionTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Baik Dikonsumsi Sebelum</span>
                      <span className="text-gray-900 font-medium">{formatDateTime(product.bestBefore)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-amber-200">
                      <span className="text-gray-600">Status Kelayakan</span>
                      <span className={`font-semibold ${isFreshProductStillGood(product.bestBefore) ? "text-green-700" : "text-red-600"}`}>
                        {isFreshProductStillGood(product.bestBefore) ? "✅ Masih layak dikonsumsi" : "❌ Sudah tidak layak"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {product.productType === "packaged" && product.expiryDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm">📅 Informasi Kadaluarsa</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal Kadaluarsa</span>
                      <span className="text-gray-900 font-medium">{formatDateTime(product.expiryDate)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-blue-200">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-semibold ${new Date(product.expiryDate) > new Date() ? "text-green-700" : "text-red-600"}`}>
                        {new Date(product.expiryDate) > new Date() ? "✅ Masih layak" : "❌ Sudah kadaluarsa"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Detail Produk</h3>
                <ul className="space-y-1">
                  {product.details.map((d, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Jumlah:</span>
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Harga</span>
                  <span className="text-xl font-bold text-green-700">
                    {formatRupiah(product.discountPrice * quantity)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
                >
                  🛒 Tambah ke Keranjang
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
                >
                  ⚡ Beli Sekarang
                </button>
              </div>
            </div>

            {/* Shop Info */}
            {shop && (
              <Link href={`/produk?search=${encodeURIComponent(shop.name)}`} className="block">
                <div className="bg-white rounded-2xl p-4 shadow-sm mt-4 flex items-center gap-4 hover:shadow-md transition">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{shop.name}</div>
                    <div className="text-xs text-gray-400">⭐ {shop.rating} · {shop.totalProducts} produk</div>
                  </div>
                  <span className="text-green-700 text-sm font-medium">Lihat Toko →</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </main>
  );
}
