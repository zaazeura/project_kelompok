"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/lib/wishlist-context";
import Link from "next/link";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Wishlist Saya</h1>
        <p className="text-gray-500 mb-8">Produk favorit yang sudah Anda simpan</p>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">♡</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Wishlist</h2>
            <p className="text-gray-500 mb-6">Simpan produk favorit Anda dengan menekan tombol hati.</p>
            <Link
              href="/produk"
              className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
            >
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{items.length} produk disimpan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
