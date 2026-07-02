export interface Product {
  id: number;
  name: string;
  slug: string;
  shopId: string;
  categorySlug: string;
  image: string;
  images: string[];
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  description: string;
  details: string[];
  location: string;
  distance: string;
  expiryTime: string;
  /** "fresh" = makanan segar/produksi restoran, "packaged" = produk kemasan */
  productType: "fresh" | "packaged";
  /** Untuk produk fresh: waktu produksi, format ISO */
  productionTime?: string;
  /** Untuk produk fresh: waktu "baik dikonsumsi sebelum", format ISO */
  bestBefore?: string;
  /** Untuk produk packaged: tanggal kadaluarsa, format ISO */
  expiryDate?: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    slug: "nasi-goreng-spesial",
    shopId: "warung-bu-sari",
    categorySlug: "makanan-minuman",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop",
    ],
    originalPrice: 35000,
    discountPrice: 17500,
    discountPercent: 50,
    description: "Nasi goreng spesial dengan bumbu rahasia Warung Bu Sari. Menggunakan nasi pilihan, telur ayam kampung, dan ayam goreng crispy. Disajikan dengan acar segar dan kerupuk udang.",
    details: [
      "Porsi: 1 porsi (350g)",
      "Bahan: Nasi, telur, ayam, bumbu spesial",
      "Alergen: Telur, gluten",
      "Cara penyajian: Siap santap",
      "Simpan di suhu ruang, konsumsi dalam 3 jam",
    ],
    location: "Warung Bu Sari, Jakarta",
    distance: "0.8 km",
    expiryTime: "3 jam",
    productType: "fresh",
    productionTime: "2026-07-02T08:00:00",
    bestBefore: "2026-07-02T20:00:00",
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    tags: ["makanan", "nasi", "pedas", "favorit"],
  },
  {
    id: 2,
    name: "Roti Croissant",
    slug: "roti-croissant",
    shopId: "bakery-corner",
    categorySlug: "makanan-minuman",
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549931319-a545753467c8?w=800&h=600&fit=crop",
    ],
    originalPrice: 25000,
    discountPrice: 10000,
    discountPercent: 60,
    description: "Croissant mentega ala Perancis yang dibuat segar setiap pagi. Memiliki tekstur renyah di luar dan lembut di dalam dengan rasa mentega yang kaya.",
    details: [
      "Isi: 1 buah croissant",
      "Bahan: Tepung terigu, mentega, telur, gula, garam",
      "Alergen: Gluten, telur, susu",
      "Cara penyajian: Panaskan sebentar untuk hasil terbaik",
      "Terbaik dikonsumsi hari yang sama",
    ],
    location: "Bakery Corner, Jakarta",
    distance: "1.2 km",
    expiryTime: "2 jam",
    productType: "fresh",
    productionTime: "2026-07-02T06:00:00",
    bestBefore: "2026-07-02T18:00:00",
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    tags: ["roti", "manis", "mentega", "artisan"],
  },
  {
    id: 3,
    name: "Salad Segar",
    slug: "salad-segar",
    shopId: "green-kitchen",
    categorySlug: "makanan-minuman",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1543339308-d595c4f4cbb4?w=800&h=600&fit=crop",
    ],
    originalPrice: 45000,
    discountPrice: 22500,
    discountPercent: 50,
    description: "Salad segar dari Green Kitchen dengan sayuran organik pilihan. Dilengkapi dengan dressing olive oil homemade dan topping kacang almond.",
    details: [
      "Porsi: 1 porsi (300g)",
      "Bahan: Selada, tomat, timun, wortel, almond, olive oil",
      "Alergen: Kacang",
      "Cara penyajian: Aduk rata sebelum makan",
      "Simpan di kulkas, konsumsi dalam 6 jam",
    ],
    location: "Green Kitchen, Jakarta",
    distance: "0.5 km",
    expiryTime: "4 jam",
    productType: "fresh",
    productionTime: "2026-07-02T07:00:00",
    bestBefore: "2026-07-02T19:00:00",
    inStock: true,
    rating: 4.9,
    reviewCount: 156,
    tags: ["sehat", "organik", "sayuran", "vegan"],
  },
  {
    id: 4,
    name: "Kopi Americano",
    slug: "kopi-americano",
    shopId: "coffee-bean",
    categorySlug: "makanan-minuman",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&h=600&fit=crop",
    ],
    originalPrice: 30000,
    discountPrice: 15000,
    discountPercent: 50,
    description: "Kopi Americano dari biji kopi Toraja pilihan. Diseduh dengan teknik pour-over untuk menghasilkan rasa yang kaya dan aroma yang harum.",
    details: [
      "Ukuran: Large (350ml)",
      "Biji kopi: Toraja, roasted medium",
      "Cara seduh: Pour-over",
      "Tambahan: Gula, susu tersedia",
      "Kafein: Tinggi",
    ],
    location: "Coffee Bean, Jakarta",
    distance: "1.5 km",
    expiryTime: "1 jam",
    productType: "fresh",
    productionTime: "2026-07-02T08:30:00",
    bestBefore: "2026-07-02T10:30:00",
    inStock: true,
    rating: 4.6,
    reviewCount: 203,
    tags: ["kopi", "minuman", "kafein", "toraja"],
  },
  {
    id: 5,
    name: "Pizza Pepperoni",
    slug: "pizza-pepperoni",
    shopId: "pizza-delight",
    categorySlug: "makanan-minuman",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop",
    ],
    originalPrice: 85000,
    discountPrice: 42500,
    discountPercent: 50,
    description: "Pizza Pepperoni klasik dari Pizza Delight dengan pepperoni import dan keju mozzarella premium. Dipanggang dalam wood-fired oven dengan suhu 400°C.",
    details: [
      "Ukuran: Medium (8 potong)",
      "Topping: Pepperoni, mozzarella, saus tomat",
      "Alergen: Gluten, susu",
      "Cara penyajian: Panaskan dalam oven 180°C selama 5 menit",
      "Simpan di kulkas, konsumsi dalam 2 hari",
    ],
    location: "Pizza Delight, Jakarta",
    distance: "2.1 km",
    expiryTime: "2.5 jam",
    productType: "fresh",
    productionTime: "2026-07-02T09:00:00",
    bestBefore: "2026-07-02T21:00:00",
    inStock: true,
    rating: 4.5,
    reviewCount: 178,
    tags: ["pizza", "italia", "pepperoni", "premium"],
  },
  {
    id: 6,
    name: "Susu Yogurt",
    slug: "susu-yogurt",
    shopId: "fresh-mart",
    categorySlug: "makanan-minuman",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=600&fit=crop",
    ],
    originalPrice: 15000,
    discountPrice: 7500,
    discountPercent: 50,
    description: "Yogurt segar dengan rasa blueberry alami. Mengandung probiotik yang baik untuk pencernaan. Tanpa bahan pengawet.",
    details: [
      "Ukuran: 250ml",
      "Rasa: Blueberry",
      "Bahan: Susu sapi, kultur bakteri baik, buah blueberry",
      "Alergen: Susu",
      "Simpan di suhu 2-8°C",
    ],
    location: "Fresh Mart, Jakarta",
    distance: "0.3 km",
    expiryTime: "5 jam",
    productType: "packaged",
    expiryDate: "2026-07-15T00:00:00",
    inStock: true,
    rating: 4.4,
    reviewCount: 67,
    tags: ["susu", "yogurt", "sehat", "probiotik"],
  },
  {
    id: 7,
    name: "Parfum Rose Garden",
    slug: "parfum-rose-garden",
    shopId: "fresh-mart",
    categorySlug: "kosmetik",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&h=600&fit=crop",
    ],
    originalPrice: 125000,
    discountPrice: 87500,
    discountPercent: 30,
    description: "Parfum dengan aroma mawar alami yang lembut dan tahan lama. Cocok untuk penggunaan sehari-hari.",
    details: [
      "Ukuran: 50ml",
      "Aroma: Rose, Musk, Vanilla",
      "Jenis: Eau de Parfum",
      "Ketahanan: 6-8 jam",
      "Untuk: Wanita",
    ],
    location: "Fresh Mart, Jakarta",
    distance: "0.3 km",
    expiryTime: "30 hari",
    productType: "packaged",
    expiryDate: "2027-07-02T00:00:00",
    inStock: true,
    rating: 4.3,
    reviewCount: 45,
    tags: ["parfum", "wanita", "mawar", "kosmetik"],
  },
  {
    id: 8,
    name: "Vitamin C 1000mg",
    slug: "vitamin-c-1000mg",
    shopId: "fresh-mart",
    categorySlug: "obat-kesehatan",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800&h=600&fit=crop",
    ],
    originalPrice: 45000,
    discountPrice: 36000,
    discountPercent: 20,
    description: "Suplemen Vitamin C 1000mg untuk meningkatkan daya tahan tubuh. Dengan tambahan Zinc dan Rose Hips.",
    details: [
      "Isi: 30 tablet",
      "Kandungan: Vitamin C 1000mg, Zinc 10mg, Rose Hips",
      "Cara pakai: 1 tablet sehari, diminum setelah makan",
      "Peringatan: Jangan melebihi dosis yang dianjurkan",
      "Kadaluarsa: 24 bulan dari tanggal produksi",
    ],
    location: "Fresh Mart, Jakarta",
    distance: "0.3 km",
    expiryTime: "7 hari",
    productType: "packaged",
    expiryDate: "2028-06-15T00:00:00",
    inStock: true,
    rating: 4.6,
    reviewCount: 112,
    tags: ["vitamin", "kesehatan", "suplemen", "imun"],
  },
  {
    id: 9,
    name: "Set Peralatan Dapur",
    slug: "set-peralatan-dapur",
    shopId: "fresh-mart",
    categorySlug: "perlengkapan-rumah",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=600&fit=crop",
    ],
    originalPrice: 250000,
    discountPrice: 175000,
    discountPercent: 30,
    description: "Set peralatan dapur lengkap dengan 10 jenis utensil. Terbuat dari stainless steel berkualitas tinggi.",
    details: [
      "Isi: Spatula, sendok sayur, penjepit, sutil, garpu salad, dll",
      "Bahan: Stainless steel 304",
      "Gagang: Kayu jati",
      "Perawatan: Cuci dengan sabun, keringkan",
      "Garansi: 1 tahun",
    ],
    location: "Fresh Mart, Jakarta",
    distance: "0.3 km",
    expiryTime: "30 hari",
    productType: "packaged",
    inStock: true,
    rating: 4.5,
    reviewCount: 78,
    tags: ["dapur", "peralatan", "stainless", "kitchen"],
  },
  {
    id: 10,
    name: "Makanan Kucing Premium",
    slug: "makanan-kucing-premium",
    shopId: "fresh-mart",
    categorySlug: "hewan-peliharaan",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=600&fit=crop",
    ],
    originalPrice: 85000,
    discountPrice: 68000,
    discountPercent: 20,
    description: "Makanan kucing premium dengan formula khusus untuk kesehatan kulit dan bulu. Mengandung omega-3 dan omega-6.",
    details: [
      "Berat: 1kg",
      "Rasa: Salmon",
      "Untuk: Kucing dewasa",
      "Kandungan: Protein 36%, Lemak 14%, Serat 3%",
      "Cara pakai: Berikan 2-3 kali sehari sesuai kebutuhan",
    ],
    location: "Fresh Mart, Jakarta",
    distance: "0.3 km",
    expiryTime: "60 hari",
    productType: "packaged",
    expiryDate: "2027-01-02T00:00:00",
    inStock: true,
    rating: 4.7,
    reviewCount: 56,
    tags: ["kucing", "hewan", "makanan", "premium"],
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByShop(shopId: string): Product[] {
  return products.filter((p) => p.shopId === shopId);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
}
