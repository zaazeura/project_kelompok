import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import DonationCard from "@/components/DonationCard";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";
import { products } from "@/data/products";
import { donations } from "@/data/donations";
import { categories } from "@/data/categories";
import Link from "next/link";

const impactStats = [
  { icon: "🍎", num: "15,234", label: "Produk Diselamatkan" },
  { icon: "☁️", num: "2,547 kg", label: "CO₂ Terkurangi" },
  { icon: "💧", num: "89,234 L", label: "Air Terhemat" },
  { icon: "🤝", num: "342", label: "Donasi Terkirim" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero */}
      <section className="pt-32 pb-10 px-4 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Selamatkan Makanan, <span className="text-green-700">Selamatkan Bumi</span>
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Temukan makanan dan kebutuhan sehari-hari dari restoran serta toko terdekat dengan harga terjangkau
        </p>
        <SearchBar />
        <div className="flex justify-center gap-8 md:gap-12">
          <div>
            <div className="text-2xl font-bold text-green-700">15,000+</div>
            <div className="text-xs text-gray-500">Produk Diselamatkan</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">500+</div>
            <div className="text-xs text-gray-500">Mitra Toko</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">2.5 Ton</div>
            <div className="text-xs text-gray-500">CO₂ Terkurangi</div>
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="max-w-6xl mx-auto px-4 mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Kategori</h2>
          <Link href="/kategori" className="text-sm text-green-700 font-medium hover:underline">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Voucher Banner */}
      <section className="max-w-6xl mx-auto px-4 mb-14">
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white gap-4">
          <div>
            <div className="text-lg font-bold">🎫 Voucher Eksklusif untukmu!</div>
            <div className="text-sm text-green-100">
              Daftar sekarang dan dapatkan diskon 30% untuk pembelian pertama
            </div>
          </div>
          <Link
            href="/tentang"
            className="px-6 py-2 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition"
          >
            Daftar Gratis
          </Link>
        </div>
      </section>

      {/* Produk */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Produk Tersedia</h2>
          <Link href="/produk" className="text-sm text-green-700 font-medium hover:underline">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Donasi */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">🤝 Program Donasi</h2>
          <Link href="/donasi" className="text-sm text-green-700 font-medium hover:underline">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {donations.slice(0, 3).map((d) => (
            <DonationCard key={d.id} donation={d} />
          ))}
        </div>
      </section>

      {/* Dampak */}
      <section className="bg-green-700 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Dampak Positif Anda</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {impactStats.map((item, i) => (
              <div key={i} className="text-center bg-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold mb-1">{item.num}</div>
                <div className="text-sm text-green-100">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
