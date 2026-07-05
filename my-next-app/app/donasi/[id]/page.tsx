"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { getDonationById } from "@/data/donations";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

export default function DonationDetailPage() {
  const params = useParams();
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState(false);
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

  const pct = Math.round((donation.collected / donation.target) * 100);
  const presetAmounts = [25000, 50000, 100000, 250000];

  const handleDonate = () => {
    if (!amount || amount <= 0) return;
    setToast(`Terima kasih! Donasi ${formatRupiah(amount)} Anda berhasil dikirim.`);
    setAmount("");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700 transition">Beranda</Link>
          <span>/</span>
          <Link href="/donasi" className="hover:text-green-700 transition">Donasi</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{donation.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={donation.image}
                alt={donation.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {donation.category}
                  </span>
                  <span className="text-xs text-gray-400">Oleh {donation.organizer}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{donation.title}</h1>
                <p className="text-gray-600 mb-6">{donation.description}</p>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-700 font-bold">{formatRupiah(donation.collected)}</span>
                    <span className="text-gray-400">dari {formatRupiah(donation.target)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{pct}% tercapai</span>
                    <span>👤 {donation.donorCount} donor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donate Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h3 className="font-bold text-gray-900 mb-4">Donasi Sekarang</h3>

              {/* Preset amounts */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {presetAmounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAmount(a);
                      setCustomAmount(false);
                    }}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition border-2 ${
                      amount === a && !customAmount
                        ? "border-green-700 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-700 hover:border-green-300"
                    }`}
                  >
                    {formatRupiah(a)}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Lainnya</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                  <input
                    type="number"
                    value={customAmount ? amount : ""}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setCustomAmount(true);
                    }}
                    placeholder="Masukkan nominal"
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
                  />
                </div>
              </div>

              <button
                onClick={handleDonate}
                disabled={!amount || amount <= 0}
                className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Donasi {amount ? formatRupiah(amount) : ""}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Donasi Anda akan disalurkan oleh {donation.organizer}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </main>
  );
}
