"use client";

import { useDonation, type Donation } from "@/lib/donation-context";
import { formatRupiah } from "@/lib/format";

interface DonationReceiptProps {
  donation: Donation;
}

export default function DonationReceipt({ donation }: DonationReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptContent = `
DONATION RECEIPT
================
Receipt ID: ${donation.receiptId}
Date: ${new Date(donation.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}

Program: ${donation.programTitle}
Amount: ${formatRupiah(donation.amount)}
Status: ${donation.status.toUpperCase()}

Donor: ${donation.donorName}
${donation.donorEmail ? `Email: ${donation.donorEmail}` : ""}
${donation.message ? `Message: ${donation.message}` : ""}

Thank you for your generous donation!
================
FoodSaver Indonesia
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${donation.receiptId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm print:shadow-none">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">💚</div>
        <h2 className="text-xl font-bold text-gray-900">Terima Kasih!</h2>
        <p className="text-gray-500">Donasi Anda telah berhasil diproses</p>
      </div>

      {/* Receipt */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 mb-6">
        <div className="text-center mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Bukti Donasi</p>
          <p className="font-mono text-sm font-medium text-gray-700">{donation.receiptId}</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal</span>
            <span>{new Date(donation.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Program</span>
            <span className="text-right max-w-[200px]">{donation.programTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Donatur</span>
            <span>{donation.donorName}</span>
          </div>
          {donation.donorEmail && (
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span>{donation.donorEmail}</span>
            </div>
          )}
          {donation.message && (
            <div className="flex justify-between">
              <span className="text-gray-500">Pesan</span>
              <span className="text-right max-w-[200px] italic">"{donation.message}"</span>
            </div>
          )}
          <div className="border-t pt-3 flex justify-between">
            <span className="font-bold">Total Donasi</span>
            <span className="text-lg font-bold text-green-700">{formatRupiah(donation.amount)}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="w-3 h-3 bg-green-500 rounded-full" />
        <span className="text-sm font-medium text-green-700">Pembayaran Berhasil</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
        >
          🖨️ Cetak
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 py-2.5 bg-green-700 text-white font-medium rounded-xl hover:bg-green-800 transition"
        >
          📥 Unduh Receipt
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4 print:hidden">
        Simpan receipt ini sebagai bukti donasi Anda
      </p>
    </div>
  );
}
