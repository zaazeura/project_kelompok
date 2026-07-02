import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getCategoryBySlug, categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(slug);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero */}
      <div className="pt-24 relative h-48 md:h-64 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-2">
            <Link href="/" className="hover:text-white transition">Beranda</Link>
            <span>/</span>
            <Link href="/kategori" className="hover:text-white transition">Kategori</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {category.icon} {category.name}
          </h1>
          <p className="text-white/80 text-sm mt-1">{category.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500 mb-6">{products.length} produk tersedia</p>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">Belum ada produk di kategori ini</p>
            <Link href="/produk" className="mt-4 inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
              Lihat Semua Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Other Categories */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Kategori Lainnya</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/kategori/${c.slug}`}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-3"
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.productCount} produk</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
