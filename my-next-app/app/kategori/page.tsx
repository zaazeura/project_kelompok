"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

type SortOption = "name" | "products" | "price-low" | "price-high";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    );

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "products":
        filtered.sort((a, b) => b.productCount - a.productCount);
        break;
      case "price-low":
        filtered.sort((a, b) => {
          const avgA = getAveragePrice(a.slug);
          const avgB = getAveragePrice(b.slug);
          return avgA - avgB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const avgA = getAveragePrice(a.slug);
          const avgB = getAveragePrice(b.slug);
          return avgB - avgA;
        });
        break;
    }

    return filtered;
  }, [search, sortBy]);

  function getAveragePrice(categorySlug: string): number {
    const categoryProducts = products.filter((p) => p.categorySlug === categorySlug);
    if (categoryProducts.length === 0) return 0;
    const total = categoryProducts.reduce((sum, p) => sum + p.discountPrice, 0);
    return total / categoryProducts.length;
  }

  function getCategoryStats(categorySlug: string) {
    const categoryProducts = products.filter((p) => p.categorySlug === categorySlug);
    const prices = categoryProducts.map((p) => p.discountPrice);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const avgRating = categoryProducts.length > 0
      ? categoryProducts.reduce((sum, p) => sum + p.rating, 0) / categoryProducts.length
      : 0;
    const discountedCount = categoryProducts.filter((p) => p.discountPercent > 0).length;

    return { minPrice, maxPrice, avgPrice, avgRating, discountedCount, total: categoryProducts.length };
  }

  const selectedCat = selectedCategory ? categories.find((c) => c.slug === selectedCategory) : null;
  const selectedProducts = selectedCategory
    ? products.filter((p) => p.categorySlug === selectedCategory)
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kategori Produk</h1>
          <p className="text-gray-500">Temukan produk berdasarkan kategori yang Anda butuhkan</p>
        </div>

        {/* Search and Sort */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kategori..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition bg-white"
              >
                <option value="name">Urutkan: Nama</option>
                <option value="products">Urutkan: Jumlah Produk</option>
                <option value="price-low">Urutkan: Harga Terendah</option>
                <option value="price-high">Urutkan: Harga Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-500">Total: </span>
            <span className="font-bold text-green-700">{filteredCategories.length} kategori</span>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-500">Total Produk: </span>
            <span className="font-bold text-green-700">
              {filteredCategories.reduce((sum, c) => sum + c.productCount, 0)} produk
            </span>
          </div>
        </div>

        {/* Categories Grid */}
        {!selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((cat) => {
              const stats = getCategoryStats(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group text-left"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{cat.icon}</span>
                        <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                      </div>
                      <p className="text-white/80 text-sm line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-green-700">{cat.productCount}</p>
                        <p className="text-gray-500 text-xs">Produk</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-orange-600">{stats.discountedCount}</p>
                        <p className="text-gray-500 text-xs">Diskon</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-blue-600">{formatRupiah(stats.avgPrice)}</p>
                        <p className="text-gray-500 text-xs">Rata-rata</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-yellow-600">⭐ {stats.avgRating.toFixed(1)}</p>
                        <p className="text-gray-500 text-xs">Rating</p>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-green-700 font-medium text-sm group-hover:underline">
                        Lihat Produk →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Category Detail View */
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 text-green-700 hover:underline flex items-center gap-1"
            >
              ← Kembali ke Kategori
            </button>

            {selectedCat && (
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{selectedCat.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCat.name}</h2>
                    <p className="text-gray-500">{selectedCat.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">{selectedCat.productCount}</p>
                    <p className="text-xs text-gray-500">Total Produk</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">{formatRupiah(getCategoryStats(selectedCat.slug).minPrice)}</p>
                    <p className="text-xs text-gray-500">Harga Terendah</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-orange-700">{formatRupiah(getCategoryStats(selectedCat.slug).maxPrice)}</p>
                    <p className="text-xs text-gray-500">Harga Tertinggi</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-700">⭐ {getCategoryStats(selectedCat.slug).avgRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Rating Rata-rata</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/produk/${product.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {product.discountPercent > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-green-700 transition">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.location}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-lg font-bold text-green-700">{formatRupiah(product.discountPrice)}</span>
                      {product.discountPercent > 0 && (
                        <span className="text-sm text-gray-400 line-through">{formatRupiah(product.originalPrice)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">⭐ {product.rating} ({product.reviewCount})</span>
                      <span className="text-xs text-gray-400">{product.expiryTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {selectedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-gray-500">Tidak ada produk di kategori ini</p>
              </div>
            )}
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500">Tidak ada kategori yang sesuai dengan pencarian</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
