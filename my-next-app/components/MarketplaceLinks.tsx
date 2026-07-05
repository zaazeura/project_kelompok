"use client";

import type { MarketplaceLink } from "@/data/products";

interface MarketplaceLinksProps {
  links: MarketplaceLink[];
}

export default function MarketplaceLinks({ links }: MarketplaceLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-4">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-xl">🛒</span>
        Beli di Marketplace Lain
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Produk ini juga tersedia di marketplace favorit Anda
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition group"
          >
            <span className="text-2xl">{link.icon}</span>
            <div className="flex-1">
              <span className="font-semibold text-gray-900 group-hover:text-green-700 transition">
                {link.name}
              </span>
              <p className="text-xs text-gray-400">Beli di {link.name}</p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
