"use client";

import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuantitySelector from "@/components/QuantitySelector";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Keranjang Belanja</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-500 mb-6">Belum ada produk di keranjang Anda.</p>
            <Link
              href="/produk"
              className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{totalItems} produk di keranjang</p>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition"
                >
                  Hapus Semua
                </button>
              </div>
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
                  <Link href={`/produk/${item.product.id}`} className="shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/produk/${item.product.id}`}
                          className="font-semibold text-gray-900 hover:text-green-700 transition line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {item.product.distance}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition text-sm shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.product.id, q)}
                      />
                      <div className="text-right">
                        <div className="text-xs text-gray-400 line-through">
                          {formatRupiah(item.product.originalPrice * item.quantity)}
                        </div>
                        <div className="font-bold text-orange-500">
                          {formatRupiah(item.product.discountPrice * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
                <h3 className="font-bold text-gray-900 mb-4">Ringkasan Belanja</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal ({totalItems} produk)</span>
                    <span className="text-gray-900">{formatRupiah(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ongkos Kirim</span>
                    <span className="text-green-700 font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Diskon Voucher</span>
                    <span className="text-green-700 font-medium">-Rp 0</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-green-700">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full py-3 mt-6 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition text-center"
                >
                  Checkout Sekarang
                </Link>
                <Link
                  href="/produk"
                  className="block w-full py-3 mt-3 border-2 border-green-700 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition text-center"
                >
                  Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
