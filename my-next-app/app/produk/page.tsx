"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const MARKETPLACES = [
  { id: "tokopedia", name: "Tokopedia", icon: "🟢", color: "bg-green-600" },
  { id: "shopee", name: "Shopee", icon: "🟠", color: "bg-orange-500" },
  { id: "lazada", name: "Lazada", icon: "🔵", color: "bg-blue-600" },
  { id: "tiktokshop", name: "TikTok Shop", icon: "🎵", color: "bg-black" },
  { id: "bukalapak", name: "Bukalapak", icon: "🔴", color: "bg-red-600" },
];

function getMarketplaceUrl(id: string, q: string) {
  const search = encodeURIComponent(q);
  switch (id) {
    case "tokopedia":
      return `https://www.tokopedia.com/search?st=product&q=${search}`;
    case "shopee":
      return `https://shopee.co.id/search?keyword=${search}`;
    case "lazada":
      return `https://www.lazada.co.id/catalog/?q=${search}`;
    case "tiktokshop":
      return `https://www.tiktok.com/search?q=${search}`;
    case "bukalapak":
      return `https://www.bukalapak.com/products?search%5Bkeywords%5D=${search}`;
    default:
      return `https://www.google.com/search?q=${search}`;
  }
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("price-low");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showTab, setShowTab] = useState<"earthshop" | "marketplace">("earthshop");
  const [activeMarketplace, setActiveMarketplace] = useState("tokopedia");

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

  const marketplaceUrl = getMarketplaceUrl(activeMarketplace, search || "semua produk");

  return (
    <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {search ? `Hasil Pencarian: "${search}"` : "Semua Produk"}
      </h1>

      {/* Tab Switcher: EarthShop vs Marketplace */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowTab("earthshop")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
            showTab === "earthshop"
              ? "bg-green-700 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🌍 EarthShop ({filteredProducts.length})
        </button>
        <button
          onClick={() => setShowTab("marketplace")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
            showTab === "marketplace"
              ? "bg-orange-500 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🛒 Marketplace Lain
        </button>
      </div>

      {showTab === "earthshop" ? (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900 placeholder-gray-500"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900"
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
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900"
            >
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
              <p className="text-gray-500 text-lg">Produk tidak ditemukan di EarthShop</p>
              <p className="text-gray-400 text-sm mt-2">Coba cari di marketplace lain atau kata kunci berbeda</p>
              <button
                onClick={() => setShowTab("marketplace")}
                className="mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
              >
                Cari di Marketplace Lain
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Marketplace Tab */
        <div className="space-y-4">
          {/* Marketplace Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {MARKETPLACES.map((mp) => (
              <button
                key={mp.id}
                onClick={() => setActiveMarketplace(mp.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  activeMarketplace === mp.id
                    ? `${mp.color} text-white shadow-md`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{mp.icon}</span>
                {mp.name}
              </button>
            ))}
          </div>

          {/* Marketplace Iframe */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Hasil pencarian &quot;{search || 'semua produk'}&quot; di{" "}
                <span className="font-semibold">{MARKETPLACES.find((m) => m.id === activeMarketplace)?.name}</span>
              </span>
              <a
                href={marketplaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-700 hover:underline flex items-center gap-1"
              >
                Buka di tab baru
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <iframe
              src={marketplaceUrl}
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title={`Produk di ${activeMarketplace}`}
            />
          </div>
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
