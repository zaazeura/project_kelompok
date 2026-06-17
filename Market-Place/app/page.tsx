import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-6xl">
        
        {/* JUDUL */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-800">
            Sitemap Aplikasi Manajemen Produk Kelompok
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Struktur Navigasi Halaman Web Bertingkat
          </p>
        </div>

        {/* HOME */}
        <div className="flex justify-center mb-10">
          <div className="bg-emerald-600 text-white px-10 py-3 rounded-lg text-sm font-bold shadow-md border border-emerald-700">
            Beranda
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* KATEGORI */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="bg-amber-500 text-white text-center py-2 rounded-lg text-xs font-bold mb-4">
              Kategori Produk
            </div>

            <div className="pl-2 border-l-2 border-amber-300 space-y-3">
              
              <Link
                href="/makanan"
                className="block p-2 bg-amber-50 hover:bg-amber-100 rounded border text-xs font-bold"
              >
                └─ Makanan & Minuman
              </Link>

              <Link
                href="/kosmetik"
                className="block p-2 bg-amber-50 hover:bg-amber-100 rounded border text-xs font-bold"
              >
                └─ Kosmetik
              </Link>

              <div className="p-2 bg-slate-50 rounded border text-xs text-slate-400">
                └─ Obat-Obatan
              </div>

            </div>
          </div>

          {/* LAYANAN */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="bg-orange-500 text-white text-center py-2 rounded-lg text-xs font-bold mb-4">
              Layanan Utama
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold">By Team</div>
              <div className="pl-4 text-slate-500">
                <div>Product Management</div>
                <div>Cek Stok Real-Time</div>
                <div>Sistem Antrian</div>
              </div>
            </div>
          </div>

          {/* PROMO */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="bg-rose-500 text-white text-center py-2 rounded-lg text-xs font-bold mb-4">
              Promo & Sosial
            </div>

            <div className="text-xs text-slate-400 space-y-2">
              <div>Diskon Toko</div>
              <div>Sistem Donasi</div>
              <div>Support Team</div>
            </div>
          </div>

          {/* AKUN */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="bg-sky-500 text-white text-center py-2 rounded-lg text-xs font-bold mb-4">
              Akun & Informasi
            </div>

            <div className="text-xs text-slate-400 space-y-2">
              <div>User Impact Score</div>
              <div>Expired Alert</div>
              <div>Halaman Login</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}