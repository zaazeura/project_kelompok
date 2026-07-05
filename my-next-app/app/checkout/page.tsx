"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useHistory } from "@/lib/history-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import DeliveryMap from "@/components/DeliveryMap";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { addOrder } = useHistory();
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    payment: "transfer",
    delivery: "delivery",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({
      items: items.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        price: item.product.discountPrice,
      })),
      total: totalPrice,
      delivery: form.delivery,
    });
    setToast("Pesanan berhasil! Riwayat belanja Anda sudah tercatat.");
    clearCart();
  };

  if (items.length === 0 && !toast) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tidak Ada Pesanan</h1>
          <p className="text-gray-500 mb-6">Keranjang Anda kosong. Mulai belanja terlebih dahulu.</p>
          <Link href="/produk" className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
            Mulai Belanja
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {/* Eco Notice */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <span className="text-2xl">🌍</span>
          <div>
            <p className="font-semibold text-green-800">EarthShop - Belanja Tanpa Plastik</p>
            <p className="text-sm text-green-700 mt-1">Semua produk yang kami kirim tidak menggunakan pembungkus plastik. Kami menggunakan kemasan ramah lingkungan yang dapat didaur ulang atau terurai secara alami.</p>
          </div>
        </div>

        {/* Delivery Area Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <span className="text-2xl">📍</span>
          <div>
            <p className="font-semibold text-blue-800">Area Pengiriman: Balikpapan Saja</p>
            <p className="text-sm text-blue-700 mt-1">Pengiriman hanya tersedia untuk area Balikpapan. Untuk pengambilan di toko, silakan pilih metode "Ambil di Toko".</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Data Diri</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pengiriman</label>
                  <textarea
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                {/* Google Maps Delivery Location */}
                {form.delivery === "delivery" && (
                  <DeliveryMap
                    address={form.address}
                    onAddressChange={(addr) => setForm({ ...form, address: addr })}
                  />
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
                    placeholder="Contoh: Antar ke rumah"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Metode Pengiriman</h3>
              <div className="space-y-3">
                {[
                  { id: "delivery", label: "Antar ke Alamat", icon: "🚚", desc: "Diantar ke alamat Anda" },
                  { id: "pickup", label: "Ambil di Toko", icon: "🏪", desc: "Ambil langsung di toko terdekat" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                      form.delivery === method.id
                        ? "border-green-700 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={method.id}
                      checked={form.delivery === method.id}
                      onChange={(e) => setForm({ ...form, delivery: e.target.value })}
                      className="accent-green-700"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <span className="font-medium text-gray-900">{method.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{method.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Metode Pembayaran</h3>
              <div className="space-y-3">
                {[
                  { id: "transfer", label: "Transfer Bank", icon: "🏦" },
                  { id: "ewallet", label: "E-Wallet", icon: "📱" },
                  { id: "cod", label: "Bayar di Tempat (COD)", icon: "💵" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                      form.payment === method.id
                        ? "border-green-700 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={form.payment === method.id}
                      onChange={(e) => setForm({ ...form, payment: e.target.value })}
                      className="accent-green-700"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatRupiah(item.product.discountPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {form.delivery === "pickup" ? "Biaya Pengambilan" : "Ongkos Kirim"}
                  </span>
                  <span className="text-green-700 font-medium">Gratis</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-green-700">{formatRupiah(totalPrice)}</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 mt-6 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </main>
  );
}
