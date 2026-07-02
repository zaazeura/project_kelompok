export interface Donation {
  id: number;
  title: string;
  slug: string;
  description: string;
  target: number;
  collected: number;
  donorCount: number;
  image: string;
  organizer: string;
  endDate: string;
  category: string;
}

export const donations: Donation[] = [
  {
    id: 1,
    title: "Paket Sembako untuk Lansia",
    slug: "paket-sembako-lansia",
    description: "Program donasi untuk menyediakan paket sembako bagi lansia yang membutuhkan di wilayah Jakarta dan sekitarnya. Setiap paket berisi beras, minyak goreng, gula, teh, dan kebutuhan pokok lainnya.",
    target: 5000000,
    collected: 3250000,
    donorCount: 128,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=400&fit=crop",
    organizer: "Yayasan Peduli Lansia",
    endDate: "2026-08-15",
    category: "Sosial",
  },
  {
    id: 2,
    title: "Makanan Anak Yatim Piatu",
    slug: "makanan-anak-yatim-piatu",
    description: "Menyediakan makanan bergizi untuk anak-anak yatim piatu di panti asuhan. Donasi Anda akan digunakan untuk membeli bahan makanan segar dan memasak makanan sehat setiap hari.",
    target: 3000000,
    collected: 2100000,
    donorCount: 89,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    organizer: "Yayasan Harapan Anak",
    endDate: "2026-09-01",
    category: "Pendidikan",
  },
  {
    id: 3,
    title: "Bantuan Korban Bencana Alam",
    slug: "bantuan-korban-bencana-alam",
    description: "Mengumpulkan dana untuk membantu korban bencana alam di berbagai daerah Indonesia. Dana akan digunakan untuk makanan, obat-obatan, dan kebutuhan darurat lainnya.",
    target: 10000000,
    collected: 6750000,
    donorCount: 234,
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop",
    organizer: "Palang Merah Indonesia",
    endDate: "2026-12-31",
    category: "Bencana",
  },
  {
    id: 4,
    title: "Beasiswa Anak Terpelajar",
    slug: "beasiswa-anak-terpelajar",
    description: "Program beasiswa untuk anak-anak kurang mampu yang berprestasi di bidang akademik. Donasi Anda akan membantu biaya pendidikan dan perlengkapan sekolah.",
    target: 8000000,
    collected: 4200000,
    donorCount: 156,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
    organizer: "Yayasan Pendidikan Bangsa",
    endDate: "2026-10-30",
    category: "Pendidikan",
  },
  {
    id: 5,
    title: "Program Air Bersih untuk Desa",
    slug: "program-air-bersih-desa",
    description: "Membangun fasilitas air bersih di desa-desa terpencil yang masih kekurangan akses air bersih. Setiap donasi akan membantu membangun sumur dan instalasi air bersih.",
    target: 15000000,
    collected: 8900000,
    donorCount: 312,
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop",
    organizer: "Yayasan Air Bersih Indonesia",
    endDate: "2027-03-01",
    category: "Lingkungan",
  },
  {
    id: 6,
    title: "Pangan untuk Dhuafa",
    slug: "pangan-untuk-dhuafa",
    description: "Program distribusi makanan gratis untuk kaum dhuafa dan fakir makan. Makanan dikumpulkan dari donasi makanan berlebih dan didistribusikan setiap minggu.",
    target: 4000000,
    collected: 2800000,
    donorCount: 198,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    organizer: "Lembaga Amil Zakat",
    endDate: "2026-11-15",
    category: "Sosial",
  },
];

export function getDonationById(id: number): Donation | undefined {
  return donations.find((d) => d.id === id);
}

export function getDonationBySlug(slug: string): Donation | undefined {
  return donations.find((d) => d.slug === slug);
}
