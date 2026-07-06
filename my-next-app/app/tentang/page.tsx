import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const team = [
  { name: "Zalny Umaira Rahma", nim: "2413053", kelas: "SIB4B" },
  { name: "Rio Rachmadana Saputra", nim: "2413069", kelas: "SIB4B" },
];

const milestones = [
  { title: "Pendirian EarthShop", description: "EarthShop didirikan dengan visi mengurangi limbah plastik dan menjaga kelestarian lingkungan." },
  { title: "Ekspansi Nasional", description: "Bermitra dengan 500+ toko dan restoran di berbagai kota besar Indonesia." },
  { title: "Program Donasi", description: "Meluncurkan program donasi untuk membantu masyarakat yang membutuhkan." },
  { title: "Dampak Nasional", description: "Menyelamatkan 15,000+ produk dari limbah plastik dan mengurangi 2.5 ton CO₂." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tentang <span className="text-green-700">EarthShop</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami percaya setiap belanjaan bisa menjadi langkah kecil untuk bumi. EarthShop hadir untuk menghubungkan toko dan restoran
            dengan masyarakat, tanpa menggunakan plastik sekali pakai.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: "🌱", title: "Sustainability", desc: "Mengurangi limbah plastik dan menjaga kelestarian lingkungan." },
            { icon: "🤝", title: "Community", desc: "Membangun komunitas yang saling peduli dan berbagi." },
            { icon: "💡", title: "Innovation", desc: "Menggunakan teknologi untuk solusi ramah lingkungan yang lebih baik." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Tim Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {team.map((member) => (
              <div key={member.nim} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-500">NIM: {member.nim}</p>
                <p className="text-xs text-gray-400 mt-1">Kelas: {member.kelas}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Perjalanan Kami</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-green-200" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className={`flex items-center ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${i % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <div className="bg-white rounded-2xl p-5 shadow-sm inline-block">
                      <h3 className="font-semibold text-gray-900">{m.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{m.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow relative z-10" />
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-green-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Bergabung dengan EarthShop</h2>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">
            Jadilah bagian dari perubahan positif. Daftarkan toko Anda atau mulai belanja ramah lingkungan hari ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/kontak" className="px-6 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition">
              Hubungi Kami
            </a>
            <a href="/produk" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Mulai Belanja
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
