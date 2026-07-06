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
  /** Tipe donasi: uang atau makanan */
  donationType: "money" | "food" | "both";
  /** Daftar makanan yang dibutuhkan (untuk donasi makanan) */
  foodItems?: string[];
}

export const donations: Donation[] = [
  {
    id: 1,
    title: "Makanan Bergizi untuk Panti Asuhan",
    slug: "makanan-panti-asuhan",
    description: "Menyediakan makanan bergizi setiap hari untuk anak-anak di Panti Asuhan Harapan Bangsa. Donasi Anda akan digunakan untuk membeli bahan makanan segar dari mitra EarthShop.",
    target: 5000000,
    collected: 3250000,
    donorCount: 128,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    organizer: "Panti Asuhan Harapan Bangsa",
    endDate: "2026-08-15",
    category: "Panti Asuhan",
    donationType: "both",
    foodItems: ["Beras 5kg", "Minyak goreng 2L", "Gula 1kg", "Telur 1kg", "Sayuran segar"],
  },
  {
    id: 2,
    title: "Paket Sembako untuk Panti Jompo",
    slug: "sembako-panti-jompo",
    description: "Menyediakan paket sembako bagi lansia di Panti Jompo Wisma Tuna Netra. Setiap paket berisi beras, minyak goreng, gula, dan kebutuhan pokok lainnya.",
    target: 4000000,
    collected: 2800000,
    donorCount: 95,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=400&fit=crop",
    organizer: "Panti Jompo Wisma Tuna Netra",
    endDate: "2026-09-01",
    category: "Panti Jompo",
    donationType: "food",
    foodItems: ["Beras 10kg", "Minyak goreng 5L", "Gula 2kg", "Teh celup 1 box", "Kopi bubuk 500g"],
  },
  {
    id: 3,
    title: "Pangan untuk Dhuafa & Fakir Makan",
    slug: "pangan-dhuafa",
    description: "Program distribusi makanan gratis untuk kaum dhuafa dan fakir makan. Makanan dikumpulkan dari donasi makanan berlebih mitra EarthShop dan didistribusikan setiap minggu.",
    target: 3500000,
    collected: 2100000,
    donorCount: 167,
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop",
    organizer: "Lembaga Amil Zakat",
    endDate: "2026-10-15",
    category: "Sosial",
    donationType: "food",
    foodItems: ["Nasi kotak siap saji", "Air mineral 600ml", "Buah segar", "Roti kemasan", "Snack sehat"],
  },
  {
    id: 4,
    title: "Makanan untuk Anak Yatim Piatu",
    slug: "makanan-anak-yatim",
    description: "Menyediakan makanan sehat dan bergizi untuk anak-anak yatim piatu di Yayasan Kasih Sayang. Donasi digunakan untuk bahan makanan segar dan vitamin anak.",
    target: 3000000,
    collected: 1800000,
    donorCount: 112,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
    organizer: "Yayasan Kasih Sayang",
    endDate: "2026-11-01",
    category: "Panti Asuhan",
    donationType: "both",
    foodItems: ["Susu bubuk anak 900g", "Biskuit bayi", "Buah potong", "Sayuran organik", "Daging ayam 1kg"],
  },
  {
    id: 5,
    title: "Beasiswa Anak Panti Asuhan",
    slug: "beasiswa-anak-panti",
    description: "Program beasiswa untuk anak-anak berprestasi di panti asuhan. Donasi Anda membantu biaya pendidikan, perlengkapan sekolah, dan les tambahan.",
    target: 6000000,
    collected: 3500000,
    donorCount: 145,
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=400&fit=crop",
    organizer: "Yayasan Pendidikan Bangsa",
    endDate: "2026-12-31",
    category: "Pendidikan",
    donationType: "money",
  },
  {
    id: 6,
    title: "Makanan Sehat untuk Lansia Terlantar",
    slug: "makanan-lansia-terlantar",
    description: "Menyediakan makanan sehat dan bergizi bagi lansia terlantar yang tidak memiliki keluarga. Dikoordinasikan dengan Dinas Sosial setempat.",
    target: 4500000,
    collected: 2900000,
    donorCount: 178,
    image: "https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?w=600&h=400&fit=crop",
    organizer: "Dinas Sosial Balikpapan",
    endDate: "2027-01-15",
    category: "Panti Jompo",
    donationType: "food",
    foodItems: ["Bubur instan 20 pcs", "Susu cair UHT 1L x10", "Buah pisang 2 sisir", "Roti tawar 5 bungkus", "Madu 500ml"],
  },
];

export function getDonationById(id: number): Donation | undefined {
  return donations.find((d) => d.id === id);
}

export function getDonationBySlug(slug: string): Donation | undefined {
  return donations.find((d) => d.slug === slug);
}
