import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const team = [
  { name: "Andi Pratama", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  { name: "Sari Dewi", role: "Head of Operations", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
  { name: "Budi Santoso", role: "CTO", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { name: "Maya Putri", role: "Head of Marketing", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
];

const milestones = [
  { year: "2023", title: "Pendirian FoodSaver", description: "FoodSaver didirikan dengan visi mengurangi limbah makanan di Indonesia." },
  { year: "2024", title: "Ekspansi Nasional", description: "Bermitra dengan 500+ toko dan restoran di berbagai kota besar Indonesia." },
  { year: "2025", title: "Program Donasi", description: "Meluncurkan program donasi untuk membantu masyarakat yang membutuhkan." },
  { year: "2026", title: "Dampak Nasional", description: "Menyelamatkan 15,000+ produk dan mengurangi 2.5 ton CO₂." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tentang <span className="text-green-700">FoodSaver</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami percaya setiap makanan memiliki nilai. FoodSaver hadir untuk menghubungkan toko dan restoran
            dengan masyarakat yang membutuhkan, mengurangi limbah sekaligus membantu sesama.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: "🌱", title: "Sustainability", desc: "Mengurangi limbah makanan dan menjaga kelestarian lingkungan." },
            { icon: "🤝", title: "Community", desc: "Membangun komunitas yang saling peduli dan berbagi." },
            { icon: "💡", title: "Innovation", desc: "Menggunakan teknologi untuk solusi yang lebih baik." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Perjalanan Kami</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-green-200" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex items-center ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${i % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <div className="bg-white rounded-2xl p-5 shadow-sm inline-block">
                      <div className="text-green-700 font-bold text-sm mb-1">{m.year}</div>
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

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Tim Kami</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-3 border-green-200"
                />
                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-green-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Bergabung dengan FoodSaver</h2>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">
            Jadilah bagian dari perubahan positif. Daftarkan toko Anda atau mulai berbelanja hemat hari ini.
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
