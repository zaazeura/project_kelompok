"use client";

import { useState, useCallback } from "react";
import { useCart } from "@/lib/cart-context";
import { useHistory } from "@/lib/history-context";
import { usePayment } from "@/lib/payment-context";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { addOrder } = useHistory();
  const { createTransaction, isDuplicatePayment } = usePayment();
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    notes: "",
    payment: "transfer",
    delivery: "delivery",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Nama harus diisi";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Nama minimal 3 karakter";
    }

    // Phone validation
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (!form.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Format nomor telepon tidak valid (contoh: 08xxxxxxxxxx)";
    }

    // Address validation
    if (!form.address.trim()) {
      newErrors.address = "Alamat harus diisi";
    } else if (form.address.trim().length < 10) {
      newErrors.address = "Alamat minimal 10 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setToast({ message: "Silakan login terlebih dahulu untuk melakukan pembelian", type: "error" });
      return;
    }

    if (!validateForm()) {
      setToast({ message: "Mohon periksa form yang belum terisi dengan benar", type: "error" });
      return;
    }

    // Rate limiting: prevent rapid submissions
    const now = Date.now();
    if (now - lastSubmissionTime < 2000) {
      setToast({ message: "Tunggu sebentar sebelum mengirim pesanan lagi", type: "warning" });
      return;
    }

    // Check for duplicate payment
    if (isDuplicatePayment(Date.now())) {
      setToast({ message: "Anda sudah memiliki pesanan yang sedang diproses", type: "warning" });
      return;
    }

    setShowConfirm(true);
  };

  const confirmOrder = () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    setLastSubmissionTime(Date.now());

    // Generate transaction ID
    const txnId = `TXN-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();

    // Create order with payment details
    const newOrder = addOrder({
      items: items.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        price: item.product.discountPrice,
      })),
      total: totalPrice,
      delivery: form.delivery,
      paymentMethod: form.payment,
      transactionId: txnId,
      paymentStatus: "pending",
      customerName: form.name.trim(),
      customerPhone: form.phone.trim(),
      customerAddress: form.address.trim(),
      notes: form.notes.trim(),
    });

    // Create payment transaction
    createTransaction(newOrder.id, totalPrice, form.payment);

    // Clear cart and show success
    clearCart();
    setToast({ message: "Pesanan berhasil! Silakan lakukan pembayaran.", type: "success" });
    setIsSubmitting(false);

    // Redirect to payment page after short delay
    setTimeout(() => {
      router.push(`/payment/${newOrder.id}`);
    }, 1500);
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
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition ${
                      errors.name ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-green-600"
                    }`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition ${
                      errors.phone ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-green-600"
                    }`}
                    placeholder="08xxxxxxxxxx"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pengiriman</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition ${
                      errors.address ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-green-600"
                    }`}
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>
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
                  { id: "transfer", label: "Transfer Bank", icon: "🏦", desc: "BCA, Mandiri, BRI, BNI" },
                  { id: "ewallet", label: "E-Wallet", icon: "📱", desc: "GoPay, OVO, Dana, ShopeePay" },
                  { id: "cod", label: "Bayar di Tempat (COD)", icon: "💵", desc: "Bayar saat barang diterima" },
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
                    <div>
                      <span className="font-medium text-gray-900">{method.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{method.desc}</span>
                    </div>
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
                  <span className="text-gray-500">Subtotal ({totalItems} item)</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {form.delivery === "pickup" ? "Biaya Pengambilan" : "Ongkos Kirim"}
                  </span>
                  <span className="text-green-700 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Metode Bayar</span>
                  <span className="font-medium">
                    {form.payment === "transfer" ? "Transfer Bank" : form.payment === "ewallet" ? "E-Wallet" : "COD"}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-green-700">{formatRupiah(totalPrice)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-6 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Pesanan</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium">{form.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Telepon</span>
                <span className="font-medium">{form.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pengiriman</span>
                <span className="font-medium">{form.delivery === "delivery" ? "Antar ke Alamat" : "Ambil di Toko"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pembayaran</span>
                <span className="font-medium">
                  {form.payment === "transfer" ? "Transfer Bank" : form.payment === "ewallet" ? "E-Wallet" : "COD"}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-green-700">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 py-2.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
              >
                Ya, Pesan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
