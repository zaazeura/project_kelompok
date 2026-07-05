import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import DonationCard from "@/components/DonationCard";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";
import { TokopediaLogo, ShopeeLogo, LazadaLogo, TiktokShopLogo } from "@/components/MarketplaceLogos";
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
          Belanja Ramah Lingkungan, <span className="text-green-700">Tanpa Plastik</span>
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Temukan kebutuhan sehari-hari dari restoran serta toko terdekat dengan harga terjangkau dan tanpa plastik
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

      {/* Produk */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Produk Tersedia ({products.length} produk)</h2>
          <Link href="/produk" className="text-sm text-green-700 font-medium hover:underline">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.slice(0, 16).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
          >
            Lihat Semua {products.length} Produk →
          </Link>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>🛒</span> Belanja di Marketplace Lain
              </h2>
              <p className="text-sm text-orange-100 mt-1">Cari produk dari Shopee, Tokopedia, Lazada, dan lainnya</p>
            </div>
            <Link
              href="/produk?search="
              className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition text-sm"
            >
              Mulai Cari
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Tokopedia", Logo: TokopediaLogo, bg: "bg-[#42B549]" },
              { name: "Shopee", Logo: ShopeeLogo, bg: "bg-[#EE4D2D]" },
              { name: "Lazada", Logo: LazadaLogo, bg: "bg-[#0F146D]" },
              { name: "TikTok Shop", Logo: TiktokShopLogo, bg: "bg-black" },
            ].map((mp) => (
              <Link
                key={mp.name}
                href="/produk?search="
                className={`${mp.bg} rounded-xl p-3 text-center text-white font-medium text-sm hover:opacity-90 transition flex flex-col items-center gap-2`}
              >
                <mp.Logo size={32} />
                {mp.name}
              </Link>
            ))}
          </div>
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
