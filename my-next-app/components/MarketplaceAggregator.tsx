"use client";

import { useState } from "react";

interface MarketplaceAggregatorProps {
  productName: string;
  category?: string;
}

const MARKETPLACES = [
  {
    id: "tokopedia",
    name: "Tokopedia",
    icon: "🟢",
    color: "bg-green-600",
    hoverColor: "hover:bg-green-700",
    searchUrl: (q: string) => `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(q)}`,
  },
  {
    id: "shopee",
    name: "Shopee",
    icon: "🟠",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    searchUrl: (q: string) => `https://shopee.co.id/search?keyword=${encodeURIComponent(q)}`,
  },
  {
    id: "lazada",
    name: "Lazada",
    icon: "🔵",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    searchUrl: (q: string) => `https://www.lazada.co.id/catalog/?q=${encodeURIComponent(q)}`,
  },
  {
    id: "tiktokshop",
    name: "TikTok Shop",
    icon: "🎵",
    color: "bg-black",
    hoverColor: "hover:bg-gray-800",
    searchUrl: (q: string) => `https://www.tiktok.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: "bukalapak",
    name: "Bukalapak",
    icon: "🔴",
    color: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    searchUrl: (q: string) => `https://www.bukalapak.com/products?search%5Bkeywords%5D=${encodeURIComponent(q)}`,
  },
  {
    id: "blibli",
    name: "Blibli",
    icon: "🟣",
    color: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    searchUrl: (q: string) => `https://www.blibli.com/cari/${encodeURIComponent(q)}`,
  },
];

export default function MarketplaceAggregator({ productName, category }: MarketplaceAggregatorProps) {
  const [activeMarketplace, setActiveMarketplace] = useState("tokopedia");
  const [searchQuery, setSearchQuery] = useState(productName);
  const [isLoading, setIsLoading] = useState(true);

  const active = MARKETPLACES.find((m) => m.id === activeMarketplace)!;
  const searchUrl = active.searchUrl(searchQuery);

  const handleMarketplaceChange = (id: string) => {
    setIsLoading(true);
    setActiveMarketplace(id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm mt-4 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="text-xl">🛒</span>
            Beli di Marketplace Lain
          </h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            Tanpa keluar dari halaman
          </span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 transition text-gray-900"
            placeholder="Cari produk..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition"
          >
            Cari
          </button>
        </form>

        {/* Marketplace Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MARKETPLACES.map((mp) => (
            <button
              key={mp.id}
              onClick={() => handleMarketplaceChange(mp.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeMarketplace === mp.id
                  ? `${mp.color} text-white shadow-md`
                  : `bg-gray-100 text-gray-600 hover:bg-gray-200`
              }`}
            >
              <span>{mp.icon}</span>
              {mp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-4 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Memuat produk dari {active.name}...
          </div>
        </div>
      )}

      {/* Iframe Container */}
      <div className="relative" style={{ minHeight: "500px" }}>
        <iframe
          src={searchUrl}
          width="100%"
          height="500"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoading(false)}
          className="w-full"
          title={`Produk di ${active.name}`}
        />
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
        <span>
          Menampilkan hasil pencarian &quot;{searchQuery}&quot; di {active.name}
        </span>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700 hover:underline flex items-center gap-1"
        >
          Buka di {active.name}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
