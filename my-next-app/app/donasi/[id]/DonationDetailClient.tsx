"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { getDonationById } from "@/data/donations";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

export default function DonationDetailClient() {
  const params = useParams();
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [donateTab, setDonateTab] = useState<"money" | "food">("money");
  const [toast, setToast] = useState<string | null>(null);

  const donation = getDonationById(Number(params.id));

  if (!donation) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Donasi Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Program donasi yang Anda cari tidak tersedia.</p>
          <Link href="/donasi" className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
            Lihat Semua Donasi
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const progress = Math.round((donation.collected / donation.target) * 100);
  const presetAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  const toggleFood = (food: string) => {
    setSelectedFood((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  const handleDonateMoney = () => {
    if (!amount || amount <= 0) {
      setToast("Masukkan jumlah donasi!");
      return;
    }
    setToast(`Terima kasih! Donasi ${formatRupiah(Number(amount))} untuk "${donation.title}" berhasil tercatat.`);
    setAmount("");
  };

  const handleDonateFood = () => {
    if (selectedFood.length === 0) {
      setToast("Pilih minimal 1 item makanan untuk didonasikan!");
      return;
    }
    setToast(`Terima kasih! Donasi ${selectedFood.length} item makanan untuk "${donation.title}" berhasil tercatat.`);
    setSelectedFood([]);
  };

  const canDonateMoney = donation.donationType === "money" || donation.donationType === "both";
  const canDonateFood = donation.donationType === "food" || donation.donationType === "both";

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700 transition">Beranda</Link>
          <span>/</span>
          <Link href="/donasi" className="hover:text-green-700 transition">Donasi</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{donation.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <img src={donation.image} alt={donation.title} className="w-full h-64 object-cover" />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">{donation.category}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">oleh {donation.organizer}</span>
                {donation.donationType === "food" && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">🍽️ Donasi Makanan</span>
                )}
                {donation.donationType === "both" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">💰 + 🍽️ Uang & Makanan</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{donation.title}</h1>
              <p className="text-gray-600 text-sm leading-relaxed">{donation.description}</p>

              {/* Food Items List */}
              {donation.foodItems && donation.foodItems.length > 0 && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <h3 className="font-semibold text-orange-800 text-sm mb-2">🍽️ Makanan yang Dibutuhkan:</h3>
                  <div className="flex flex-wrap gap-2">
                    {donation.foodItems.map((food) => (
                      <span key={food} className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Terkumpul</span>
                  <span className="font-semibold text-green-700">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{formatRupiah(donation.collected)}</div>
                  <div className="text-xs text-gray-500">Terkumpul</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{donation.donorCount}</div>
                  <div className="text-xs text-gray-500">Donatur</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 text-center">
                Target: {formatRupiah(donation.target)} · Berakhir: {donation.endDate}
              </div>
            </div>

            {/* Donate Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">🤲 Donasi Sekarang</h3>

              {/* Tab Switcher */}
              {canDonateMoney && canDonateFood && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setDonateTab("money")}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl transition ${
                      donateTab === "money" ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    💰 Uang
                  </button>
                  <button
                    onClick={() => setDonateTab("food")}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl transition ${
                      donateTab === "food" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    🍽️ Makanan
                  </button>
                </div>
              )}

              {/* Money Donation */}
              {(donateTab === "money" || canDonateMoney) && !(canDonateFood && donateTab === "food") && (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {presetAmounts.map((a) => (
                      <button
                        key={a}
                        onClick={() => { setAmount(a); setCustomAmount(false); }}
                        className={`px-2 py-2 text-xs font-medium rounded-xl border-2 transition ${
                          amount === a && !customAmount ? "border-green-700 bg-green-50 text-green-800" : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {formatRupiah(a)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => { setCustomAmount(true); setAmount(""); }}
                    className={`w-full mb-3 px-3 py-2 text-xs font-medium rounded-xl border-2 transition ${
                      customAmount ? "border-green-700 bg-green-50 text-green-800" : "border-gray-200 text-gray-600"
                    }`}
                  >
                    Nominal Lain
                  </button>
                  {customAmount && (
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Masukkan nominal"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm mb-3 focus:outline-none focus:border-green-600 transition"
                    />
                  )}
                  <button onClick={handleDonateMoney} className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
                    Donasi Uang
                  </button>
                </div>
              )}

              {/* Food Donation */}
              {(donateTab === "food" || canDonateFood) && !(canDonateMoney && donateTab === "money") && donation.foodItems && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Pilih makanan yang ingin Anda donasikan:</p>
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {donation.foodItems.map((food) => (
                      <label
                        key={food}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                          selectedFood.includes(food)
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFood.includes(food)}
                          onChange={() => toggleFood(food)}
                          className="w-4 h-4 accent-orange-500"
                        />
                        <span className="text-sm text-gray-700">{food}</span>
                      </label>
                    ))}
                  </div>
                  {selectedFood.length > 0 && (
                    <div className="text-sm text-orange-600 mb-3">
                      {selectedFood.length} item dipilih
                    </div>
                  )}
                  <button onClick={handleDonateFood} className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition">
                    Donasi Makanan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </main>
  );
}
