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

export default function PaymentClient() {
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

  useEffect(() => {
    if (!transaction || paymentStatus !== "pending") return;

    const endTime = new Date(transaction.expiresAt).getTime();
    const update = () => {
      const now = Date.now();
      const diff = endTime - now;
      if (diff <= 0) {
        failPayment(transaction.id);
        setPaymentStatus("expired");
        setToast({ message: "Pembayaran telah kadaluarsa!", type: "error" });
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h}j ${m}m ${s}d`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [transaction, paymentStatus, failPayment]);

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Pesanan yang Anda cari tidak tersedia.</p>
          <Link href="/riwayat" className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
            Lihat Riwayat
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleConfirm = () => {
    if (!transaction) return;
    confirmPayment(transaction.id);
    setPaymentStatus("paid");
    setToast({ message: "Pembayaran berhasil dikonfirmasi!", type: "success" });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pembayaran</h1>

        {/* Status Banner */}
        <div className={`rounded-2xl p-4 mb-6 flex items-center gap-3 ${
          paymentStatus === "paid" ? "bg-green-50 border border-green-200" :
          paymentStatus === "failed" || paymentStatus === "expired" ? "bg-red-50 border border-red-200" :
          "bg-amber-50 border border-amber-200"
        }`}>
          <span className="text-2xl">
            {paymentStatus === "paid" ? "✅" : paymentStatus === "failed" || paymentStatus === "expired" ? "❌" : "⏳"}
          </span>
          <div>
            <p className={`font-semibold ${
              paymentStatus === "paid" ? "text-green-800" :
              paymentStatus === "failed" || paymentStatus === "expired" ? "text-red-800" :
              "text-amber-800"  
            }`}>
              {paymentStatus === "paid" ? "Pembayaran Berhasil" :
               paymentStatus === "failed" ? "Pembayaran Gagal" :
               paymentStatus === "expired" ? "Pembayaran Kadaluarsa" :
               "Menunggu Pembayaran"}
            </p>
            {paymentStatus === "pending" && countdown && (
              <p className="text-sm text-amber-700">Sisa waktu: {countdown}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Detail Pesanan #{order.id}</h3>
              <div className="space-y-3">
                {order.items.map((item: { name: string; qty: number; price: number }, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x{item.qty}</span>
                    <span className="font-medium">{formatRupiah(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-700">{formatRupiah(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Actions */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {paymentStatus === "pending" && (
                <button onClick={handleConfirm} className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
                  Konfirmasi Pembayaran
                </button>
              )}
              {paymentStatus === "paid" && (
                <Link href="/riwayat" className="block w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition text-center">
                  Lihat Riwayat
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
