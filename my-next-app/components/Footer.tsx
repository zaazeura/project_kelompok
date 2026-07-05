import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="text-white font-bold text-lg mb-3 flex items-center gap-1">
            <span>🌍</span> EarthShop
          </Link>
          <p className="text-sm mt-2">
            Platform marketplace ramah lingkungan tanpa plastik untuk kebutuhan sehari-hari.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
            <li><Link href="/produk" className="hover:text-white transition">Produk</Link></li>
            <li><Link href="/kategori" className="hover:text-white transition">Kategori</Link></li>
            <li><Link href="/donasi" className="hover:text-white transition">Donasi</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Akun</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/profil" className="hover:text-white transition">Profil Saya</Link></li>
            <li><Link href="/riwayat" className="hover:text-white transition">Riwayat Belanja</Link></li>
            <li><Link href="/keranjang" className="hover:text-white transition">Keranjang</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Bantuan</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link href="/kontak" className="hover:text-white transition">Hubungi Kami</Link></li>
            <li><Link href="/tentang" className="hover:text-white transition">Tentang Kami</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 text-sm border-t border-white/10 pt-6">
        &copy; 2026 EarthShop. Semua hak dilindungi.
      </div>
    </footer>
  );
}
