"use client";

import { useState, useEffect } from "react";
import { useDigitalPayment, type VirtualAccountData } from "@/lib/digital-payment-context";
import { formatRupiah } from "@/lib/format";
import Toast from "./Toast";

interface VirtualAccountDisplayProps {
  bankName: string;
  amount: number;
}

export default function VirtualAccountDisplay({ bankName, amount }: VirtualAccountDisplayProps) {
  const { generateVirtualAccount } = useDigitalPayment();
  const [vaData, setVaData] = useState<VirtualAccountData | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const va = generateVirtualAccount(bankName, amount);
    setVaData(va);
  }, [bankName, amount, generateVirtualAccount]);

  useEffect(() => {
    if (!vaData) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expires = new Date(vaData.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setCountdown("Kedaluwarsa");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown(`${hours}j ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [vaData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast("Nomor Virtual Account berhasil disalin!");
  };

  if (!vaData) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Virtual Account {vaData.bankName}</h3>

      {/* Account Number */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-500 mb-2">Nomor Virtual Account</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-gray-900 font-mono tracking-wider flex-1">
            {vaData.accountNumber}
          </p>
          <button
            onClick={() => copyToClipboard(vaData.accountNumber.replace(/\s/g, ""))}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition"
          >
            Salin
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">a.n {vaData.accountName}</p>
      </div>

      {/* Amount */}
      <div className="bg-green-50 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
        <p className="text-2xl font-bold text-green-700">{formatRupiah(vaData.amount)}</p>
      </div>

      {/* Expiry */}
      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl mb-4">
        <span className="text-sm text-gray-600">Berlaku hingga:</span>
        <span className="font-bold text-orange-600">{countdown}</span>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Cara Pembayaran:</p>
        <ol className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <span>Buka aplikasi mobile banking {vaData.bankName}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <span>Pilih menu Transfer {'>'} Virtual Account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <span>Masukkan nomor Virtual Account di atas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
            <span>Konfirmasi jumlah pembayaran</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
            <span>Selesaikan transfer</span>
          </li>
        </ol>
      </div>

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
}
