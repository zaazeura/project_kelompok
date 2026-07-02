import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationCard from "@/components/DonationCard";
import { donations } from "@/data/donations";

export default function DonationsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🤝 Program Donasi</h1>
        <p className="text-gray-500 mb-8">Bantu mereka yang membutuhkan melalui program donasi kami</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-700">
              Rp {donations.reduce((s, d) => s + d.collected, 0).toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total Terkumpul</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-700">
              {donations.reduce((s, d) => s + d.donorCount, 0)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total Donor</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-700">{donations.length}</div>
            <div className="text-xs text-gray-400 mt-1">Program Aktif</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {donations.map((d) => (
            <DonationCard key={d.id} donation={d} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
