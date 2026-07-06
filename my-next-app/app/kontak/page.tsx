"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import emailjs from "@emailjs/browser";

// ============ EMAILJS CONFIG ============
// Ganti 3 nilai ini dengan data dari EmailJS dashboard Anda:
// 1. Public Key  -> https://dashboard.emailjs.com/account
// 2. Service ID  -> https://dashboard.emailjs.com/services
// 3. Template ID -> https://dashboard.emailjs.com/templates
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
// ========================================

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );
      setToast("Pesan berhasil dikirim! Email notifikasi telah dikirim ke earthshop.team@gmail.com");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setToast("Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hubungi Kami</h1>
        <p className="text-gray-500 mb-8">Kami siap membantu Anda. Kirim pesan dan kami akan merespons segera.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: "📍", title: "Alamat", detail: "Jl. Sudirman No. 123, Balikpapan" },
              { icon: "✉️", title: "Email", detail: "earthshop.team@gmail.com" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Kirim Pesan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    name="from_name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900 placeholder-gray-400"
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="from_email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900 placeholder-gray-400"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                <select
                  name="subject"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900"
                >
                  <option value="">Pilih subjek</option>
                  <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                  <option value="Pesanan">Pesanan</option>
                  <option value="Kerja Sama">Kerja Sama</option>
                  <option value="Keluhan">Keluhan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900 placeholder-gray-400"
                  rows={5}
                  placeholder="Tulis pesan Anda..."
                />
              </div>
              <input type="hidden" name="to_email" value="earthshop.team@gmail.com" />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-900">📍 Lokasi Kami</h3>
          </div>
          <div className="relative w-full h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1279.184!2d116.836!3d-1.237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zJl.%20Sudirman%2C%20Balikpapan!5e0!3m2!1sid!2sid!4v1720000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
      <Footer />
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </main>
  );
}
