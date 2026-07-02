"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { navCategories } from "@/data/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Makanan & Minuman");
  const { totalItems } = useCart();

  return (
    <>
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-green-700 flex items-center gap-1">
            <span>🌿</span> FoodSaver
          </Link>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Beranda
            </Link>
            <Link href="/produk" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Produk
            </Link>
            <Link href="/kategori" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Kategori
            </Link>
            <Link href="/donasi" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Donasi
            </Link>
            <Link href="/tentang" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Tentang
            </Link>
            <Link href="/kontak" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Kontak
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/produk?search="
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-green-600 hover:text-white transition"
            >
              🔍
            </Link>
            <Link
              href="/keranjang"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-green-600 hover:text-white transition relative"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          <button
            className="md:hidden text-xl p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Category Strip */}
      <div className="fixed top-14 left-0 right-0 bg-white border-b z-40 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex gap-2 py-2.5">
          {navCategories.map((c) => (
            <Link
              key={c.name}
              href={`/kategori/${c.slug}`}
              onClick={() => setActive(c.name)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                active === c.name
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-white border-b shadow-lg z-50">
          <div className="p-4 space-y-3">
            <Link href="/" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Beranda
            </Link>
            <Link href="/produk" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Produk
            </Link>
            <Link href="/kategori" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Kategori
            </Link>
            <Link href="/donasi" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Donasi
            </Link>
            <Link href="/tentang" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Tentang
            </Link>
            <Link href="/kontak" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Kontak
            </Link>
            <div className="border-t pt-3">
              <Link href="/keranjang" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
                🛒 Keranjang {totalItems > 0 && `(${totalItems})`}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
