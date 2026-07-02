"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("default");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (filterCategory !== "all") {
      result = result.filter((p) => p.categorySlug === filterCategory);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case "discount":
        result.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [search, sortBy, filterCategory]);

  return (
    <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Semua Produk</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
        >
          <option value="all">Semua Kategori</option>
          <option value="makanan-minuman">Makanan & Minuman</option>
          <option value="kosmetik">Kosmetik</option>
          <option value="obat-kesehatan">Obat & Kesehatan</option>
          <option value="perlengkapan-rumah">Perlengkapan Rumah</option>
          <option value="hewan-peliharaan">Hewan Peliharaan</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
        >
          <option value="default">Urutkan</option>
          <option value="price-low">Harga Terendah</option>
          <option value="price-high">Harga Tertinggi</option>
          <option value="discount">Diskon Terbesar</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">Menampilkan {filteredProducts.length} produk</p>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">Produk tidak ditemukan</p>
          <p className="text-gray-400 text-sm mt-2">Coba kata kunci atau filter yang berbeda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense
        fallback={
          <div className="pt-28 pb-16 max-w-6xl mx-auto px-4 text-center">
            <div className="text-2xl text-gray-400">Memuat...</div>
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
