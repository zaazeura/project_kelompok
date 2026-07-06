"use client";

import { MARKETPLACE_CONFIG } from "./MarketplaceLogos";

interface MarketplaceButtonsProps {
  productName: string;
}

const MARKETPLACES = [
  { id: "tokopedia", searchUrl: (q: string) => `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(q)}` },
  { id: "shopee", searchUrl: (q: string) => `https://shopee.co.id/search?keyword=${encodeURIComponent(q)}` },
  { id: "lazada", searchUrl: (q: string) => `https://www.lazada.co.id/catalog/?q=${encodeURIComponent(q)}` },
  { id: "tiktokshop", searchUrl: (q: string) => `https://www.tiktok.com/search?q=${encodeURIComponent(q)}` },
  { id: "bukalapak", searchUrl: (q: string) => `https://www.bukalapak.com/products?search%5Bkeywords%5D=${encodeURIComponent(q)}` },
  { id: "blibli", searchUrl: (q: string) => `https://www.blibli.com/cari/${encodeURIComponent(q)}` },
];

export default function MarketplaceButtons({ productName }: MarketplaceButtonsProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
      <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
        <span>🛒</span> Beli di Marketplace Lain
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {MARKETPLACES.map((mp) => {
          const cfg = MARKETPLACE_CONFIG[mp.id];
          const url = mp.searchUrl(productName);
          return (
            <a
              key={mp.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:opacity-90 ${cfg.color} text-white`}
            >
              <cfg.Logo size={20} />
              {cfg.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
