"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import type { Donation } from "@/data/donations";

interface DonationCardProps {
  donation: Donation;
}

export default function DonationCard({ donation }: DonationCardProps) {
  const pct = Math.round((donation.collected / donation.target) * 100);

  return (
    <Link href={`/donasi/${donation.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
        <div className="relative h-44 overflow-hidden">
          <img
            src={donation.image}
            alt={donation.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="text-white font-bold">{donation.title}</div>
          </div>
          <span className="absolute top-3 right-3 px-2 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
            {donation.category}
          </span>
        </div>
        <div className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-700 font-bold">{formatRupiah(donation.collected)}</span>
            <span className="text-gray-400">dari {formatRupiah(donation.target)}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">👤 {donation.donorCount} donor</span>
            <button className="px-4 py-1.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition">
              Donasi
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
