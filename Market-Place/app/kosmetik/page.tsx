import Link from 'next/link';

export default function KosmetikPage() {
  // Contoh data produk kecantikan kelompok
  const daftarProduk = [
    { id: 1, nama: "Sunscreen SPF 50+", stok: 24, status: "Aman", tglExpired: "12-12-2027", warnaStatus: "text-emerald-600 bg-emerald-50" },
    { id: 2, nama: "Moisturizer Gel", stok: 5, status: "Hampir Habis", tglExpired: "05-10-2026", warnaStatus: "text-amber-600 bg-amber-50" },
    { id: 3, nama: "Serum Vitamin C", stok: 12, status: "CRITICAL EXP", tglExpired: "20-07-2026", warnaStatus: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
        
        {/* BADGE KATEGORI */}
        <div className="flex justify-between items-center mb-6">
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Kategori Produk
          </span>
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition">
            ← Kembali ke Beranda Sitemap
          </Link>
        </div>

        {/* JUDUL HALAMAN */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Manajemen Kosmetik</h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Pemantauan Stok, Barcode, dan Expired Alert Kelompok</p>
        </div>

        {/* FITUR SIMULASI SCAN BARCODE */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white mb-8 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base">Simulasi Sistem Scan Barcode</h3>
              <p className="text-orange-100 text-xs mt-0.5">Klik tombol untuk mensimulasikan alat scan barcode produk masuk.</p>
            </div>
            <button className="bg-white text-orange-600 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:bg-orange-50 active:scale-95 transition">
              📷 Jalankan Kamera Scanner
            </button>
          </div>
        </div>

        {/* TABEL DATA & EXPIRED ALERT */}
        <div>
          <h3 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
            📋 Daftar Stok Real-Time & Notifikasi Kedaluwarsa
          </h3>
          
          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold">
                  <th className="p-3">Nama Produk Kosmetik</th>
                  <th className="p-3">Sisa Stok</th>
                  <th className="p-3">Tanggal Kedaluwarsa</th>
                  <th className="p-3 text-center">Sistem Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {daftarProduk.map((produk) => (
                  <tr key={produk.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-semibold text-slate-800">{produk.nama}</td>
                    <td className="p-3 font-mono">{produk.stok} pcs</td>
                    <td className="p-3 text-slate-500 font-mono">{produk.tglExpired}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${produk.warnaStatus}`}>
                        {produk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}