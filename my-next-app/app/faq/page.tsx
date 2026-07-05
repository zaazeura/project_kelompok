"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "Apa itu FoodSaver?",
    a: "FoodSaver adalah platform marketplace yang menghubungkan toko dan restoran dengan masyarakat untuk mengurangi limbah makanan. Kami menjual makanan dan produk yang masih layak konsumsi dengan harga diskon.",
  },
  {
    q: "Bagaimana cara berbelanja di FoodSaver?",
    a: "Cukup pilih produk yang diinginkan, tambahkan ke keranjang, lalu checkout. Anda bisa memilih antara diantar ke alamat atau ambil langsung di toko.",
  },
  {
    q: "Apakah makanan yang dijual masih aman dikonsumsi?",
    a: "Ya! Semua produk yang dijual masih dalam kondisi baik dan layak konsumsi. Kami menampilkan informasi waktu kadaluarsa secara transparan untuk setiap produk.",
  },
  {
    q: "Bagaimana cara kerja program donasi?",
    a: "Anda bisa berdonasi melalui program-program donasi yang tersedia. Dana yang terkumpul akan disalurkan kepada penerima manfaat yang membutuhkan.",
  },
  {
    q: "Metode pembayaran apa yang diterima?",
    a: "Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA), dan bayar di tempat (COD).",
  },
  {
    q: "Bagaimana cara menghitung dampak lingkungan saya?",
    a: "Setiap pembelian Anda akan menghitung berapa kg CO₂ yang berhasil diselamatkan. Lihat profil Anda atau halaman riwayat belanja untuk melihat total dampak positif Anda.",
  },
  {
    q: "Apakah ada biaya pengiriman?",
    a: "Untuk saat ini, pengiriman di seluruh area Jakarta GRATIS! Anda juga bisa memilih opsi Ambil di Toko tanpa biaya tambahan.",
  },
  {
    q: "Bagaimana cara menjadi mitra toko?",
    a: "Hubungi kami melalui halaman Kontak untuk informasi lebih lanjut tentang menjadi mitra FoodSaver.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pertanyaan Umum (FAQ)</h1>
        <p className="text-gray-500 mb-8">Temukan jawaban untuk pertanyaan yang sering ditanyakan</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-semibold text-gray-900">{faq.q}</span>
                <span className={`text-xl transition-transform ${openIndex === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-green-50 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Masih punya pertanyaan?</h3>
          <p className="text-sm text-gray-600 mb-4">Hubungi kami melalui halaman kontak</p>
          <a
            href="/kontak"
            className="inline-block px-6 py-2.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
