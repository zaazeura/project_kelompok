"use client";

import { useState, useEffect } from "react";
import { useDigitalPayment, type QRCodeData } from "@/lib/digital-payment-context";
import { formatRupiah } from "@/lib/format";

interface QRCodeDisplayProps {
  amount: number;
  merchantName: string;
}

export default function QRCodeDisplay({ amount, merchantName }: QRCodeDisplayProps) {
  const { generateQRCode } = useDigitalPayment();
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const qr = generateQRCode(amount, merchantName);
    setQrData(qr);
  }, [amount, merchantName, generateQRCode]);

  useEffect(() => {
    if (!qrData) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expires = new Date(qrData.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setCountdown("Kedaluwarsa");
        // Generate new QR
        const newQr = generateQRCode(amount, merchantName);
        setQrData(newQr);
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [qrData, amount, merchantName, generateQRCode]);

  if (!qrData) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 text-center">Scan QR Code</h3>

      {/* QR Code Display */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-48 h-48 bg-white border-4 border-gray-800 rounded-xl flex items-center justify-center">
            {/* Simulated QR Code Pattern */}
            <div className="w-40 h-40 grid grid-cols-11 gap-0.5">
              {Array.from({ length: 121 }).map((_, i) => {
                const row = Math.floor(i / 11);
                const col = i % 11;
                // Create QR-like pattern
                const isBlack =
                  (row < 3 && col < 3) ||
                  (row < 3 && col > 7) ||
                  (row > 7 && col < 3) ||
                  (row === 3 && col === 3) ||
                  (row === 5 && col === 5) ||
                  (row === 7 && col === 7) ||
                  (i % 7 === 0) ||
                  (i % 11 === 0);
                return (
                  <div
                    key={i}
                    className={`${isBlack ? "bg-gray-800" : "bg-white"} rounded-sm`}
                  />
                );
              })}
            </div>
          </div>
          {/* Timer overlay */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            ⏱ {countdown}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">Total Pembayaran</p>
        <p className="text-2xl font-bold text-green-700">{formatRupiah(amount)}</p>
      </div>

      {/* Merchant */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">Merchant</p>
        <p className="font-medium text-gray-900">{merchantName}</p>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Cara Bayar:</p>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Buka aplikasi mobile banking atau e-wallet</li>
          <li>2. Pilih menu QRIS atau Scan QR</li>
          <li>3. Arahkan kamera ke QR Code di atas</li>
          <li>4. Konfirmasi pembayaran</li>
        </ol>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        QR Code akan diperbarui otomatis setelah kedaluwarsa
      </p>
    </div>
  );
}
