"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useHistory } from "@/lib/history-context";
import { formatRupiah } from "@/lib/format";

export default function RiwayatPage() {
  const { orders, totalSpent, totalOrders, totalCO2 } = useHistory();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Riwayat Belanja</h1>
        <p className="text-gray-500 mb-6">Lacak pembelian dan dampak positif Anda</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-700">{totalOrders}</div>
            <div className="text-xs text-gray-400 mt-1">Total Pesanan</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-700">{formatRupiah(totalSpent)}</div>
            <div className="text-xs text-gray-400 mt-1">Total Pengeluaran</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-700">{totalCO2}</div>
            <div className="text-xs text-gray-400 mt-1">CO₂ Terhemat</div>
          </div>
        </div>

        {/* History List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Riwayat</h2>
            <p className="text-gray-500 mb-6">Riwayat belanja Anda akan muncul di sini setelah checkout.</p>
            <a
              href="/produk"
              className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
            >
              Mulai Belanja
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Pesanan #{order.id}</div>
                    <div className="text-xs text-gray-400">{order.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      {order.delivery === "pickup" ? "🏪 Ambil di Toko" : "🚚 Antar"}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.qty}
                      </span>
                      <span className="font-medium text-gray-800">{formatRupiah(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <span>🌱</span>
                    <span>Menyelamatkan {order.co2Saved} CO₂</span>
                  </div>
                  <div className="font-bold text-green-700">{formatRupiah(order.total)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
