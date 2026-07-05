"use client";

import { useState } from "react";
import { useDonation } from "@/lib/donation-context";
import { formatRupiah } from "@/lib/format";
import Toast from "./Toast";

interface DonationFormProps {
  programId: number;
  programTitle: string;
  onSuccess: (donationId: string) => void;
}

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

export default function DonationForm({ programId, programTitle, onSuccess }: DonationFormProps) {
  const { makeDonation } = useDonation();
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (finalAmount < 1000) {
      setToast({ message: "Minimal donasi Rp1.000", type: "error" });
      return;
    }

    if (!name.trim()) {
      setToast({ message: "Masukkan nama Anda", type: "error" });
      return;
    }

    setIsSubmitting(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const donation = makeDonation({
      programId,
      programTitle,
      amount: finalAmount,
      donorName: name.trim(),
      donorEmail: email.trim(),
      message: message.trim(),
    });

    setIsSubmitting(false);
    setToast({ message: "Donasi berhasil! Terima kasih atas kedermawanan Anda.", type: "success" });

    setTimeout(() => {
      onSuccess(donation.id);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Nominal Donasi</label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setAmount(preset); setCustomAmount(""); }}
              className={`py-3 rounded-xl border-2 font-medium transition ${
                amount === preset && !customAmount
                  ? "border-green-700 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {formatRupiah(preset)}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
            placeholder="Nominal lainnya"
            min="1000"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
          />
        </div>
      </div>

      {/* Donor Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anda *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
            placeholder="Masukkan nama lengkap"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
            placeholder="Untuk pengiriman receipt"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pesan (Opsional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
            placeholder="Tulis pesan untuk program ini..."
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-green-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Donasi</span>
          <span className="text-xl font-bold text-green-700">{formatRupiah(finalAmount)}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || finalAmount < 1000}
        className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Memproses..." : "Donasi Sekarang"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Dengan melakukan donasi, Anda menyetujui syarat dan ketentuan yang berlaku
      </p>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </form>
  );
}
