"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHistory } from "@/lib/history-context";
import { usePayment } from "@/lib/payment-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  const { getOrderById } = useHistory();
  const { getTransactionsByOrder, confirmPayment, failPayment, verifyAmount } = usePayment();

  const order = getOrderById(orderId);
  const transactions = getTransactionsByOrder(orderId);
  const transaction = transactions[0];

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    transaction?.status || "pending"
  );
  const [countdown, setCountdown] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Countdown timer for payment expiry
  useEffect(() => {
    if (!transaction || paymentStatus !== "pending") return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expires = new Date(transaction.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setCountdown("Kedaluwarsa");
        setPaymentStatus("expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${hours}j ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [transaction, paymentStatus]);

  const handleConfirmPayment = () => {
    if (!transaction) return;

    setIsProcessing(true);

    // Simulate payment verification
    setTimeout(() => {
      const verified = verifyAmount(transaction.id, transaction.amount);
      if (verified) {
        const success = confirmPayment(transaction.id);
        if (success) {
          setPaymentStatus("paid");
          setToast({ message: "Pembayaran berhasil dikonfirmasi!", type: "success" });
        } else {
          setToast({ message: "Gagal mengkonfirmasi pembayaran", type: "error" });
        }
      } else {
        setToast({ message: "Verifikasi jumlah pembayaran gagal", type: "error" });
      }
      setIsProcessing(false);
    }, 1500);
  };

  const handlePaymentFailed = () => {
    if (!transaction) return;
    failPayment(transaction.id);
    setPaymentStatus("failed");
    setToast({ message: "Pembayaran ditandai sebagai gagal", type: "error" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast({ message: "Berhasil disalin ke clipboard", type: "success" });
  };

  if (!order || !transaction) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Pesanan yang Anda cari tidak ditemukan.</p>
          <Link href="/riwayat" className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
            Lihat Riwayat
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const getStatusBadge = () => {
    switch (paymentStatus) {
      case "paid":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Lunas</span>;
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Menunggu Pembayaran</span>;
      case "failed":
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Gagal</span>;
      case "expired":
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Kedaluwarsa</span>;
    }
  };

  const getPaymentInstructions = () => {
    switch (order.paymentMethod) {
      case "transfer":
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Transfer ke rekening berikut:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Bank BCA</p>
                    <p className="text-sm text-gray-500">a.n FoodSaver Indonesia</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard("1234567890")}
                    className="text-green-700 text-sm font-medium hover:underline"
                  >
                    Salin
                  </button>
                </div>
                <p className="text-lg font-bold text-center text-green-700">1234 5678 90</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>Penting:</strong> Transfer dengan nominal yang tepat agar pembayaran dapat diverifikasi otomatis.
              </p>
            </div>
          </div>
        );
      case "ewallet":
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-3">Bayar melalui E-Wallet:</p>
              <div className="grid grid-cols-2 gap-2">
                {["GoPay", "OVO", "Dana", "ShopeePay"].map((wallet) => (
                  <div key={wallet} className="bg-white p-3 rounded-lg border text-center font-medium">
                    {wallet}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Scan QR Code atau masukkan nomor handphone yang terdaftar di E-Wallet Anda.
            </p>
          </div>
        );
      case "cod":
        return (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800">
              <strong>Pembayaran di Tempat (COD)</strong>
            </p>
            <p className="text-sm text-green-700 mt-2">
              Siapkan uang tunai sejumlah <strong>{formatRupiah(order.total)}</strong> saat barang dikirim.
              Pembayaran dilakukan langsung kepada kurir.
            </p>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/riwayat" className="text-green-700 hover:underline text-sm mb-2 inline-block">
            &larr; Kembali ke Riwayat
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Status Pembayaran</p>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
            {paymentStatus === "pending" && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Batas Waktu</p>
                <p className="text-lg font-bold text-orange-600">{countdown}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono font-medium text-xs">{transaction.id}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Tanggal</span>
              <span>{order.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Pembayaran</span>
              <span className="text-lg font-bold text-green-700">{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        {paymentStatus === "pending" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Instruksi Pembayaran</h3>
            {getPaymentInstructions()}
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Detail Pesanan</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} x{item.qty}
                </span>
                <span className="font-medium">{formatRupiah(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-green-700">{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {paymentStatus === "pending" && (
          <div className="flex gap-3">
            <button
              onClick={handlePaymentFailed}
              className="flex-1 py-3 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition"
            >
              Pembayaran Gagal
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="flex-1 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-50"
            >
              {isProcessing ? "Memproses..." : "Sudah Bayar"}
            </button>
          </div>
        )}

        {paymentStatus === "paid" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-medium">
              ✓ Pembayaran Berhasil
            </div>
          </div>
        )}

        {paymentStatus === "expired" && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
              ⏰ Pembayaran Kedaluwarsa
            </div>
            <p className="text-sm text-gray-500">Silakan buat pesanan baru jika masih ingin membeli.</p>
            <Link
              href="/produk"
              className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
            >
              Belanja Lagi
            </Link>
          </div>
        )}
      </div>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
