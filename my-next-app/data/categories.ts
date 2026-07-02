export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    slug: "makanan-minuman",
    name: "Makanan & Minuman",
    icon: "🍽️",
    description: "Makanan segar dan minuman berkualitas dari restoran serta toko terdekat",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    productCount: 156,
  },
  {
    slug: "kosmetik",
    name: "Kosmetik",
    icon: "💄",
    description: "Produk kecantikan dan perawatan kulit dari brand ternama",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
    productCount: 89,
  },
  {
    slug: "obat-kesehatan",
    name: "Obat & Kesehatan",
    icon: "💊",
    description: "Obat-obatan dan suplemen kesehatan untuk keluarga Anda",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop",
    productCount: 67,
  },
  {
    slug: "perlengkapan-rumah",
    name: "Perlengkapan Rumah",
    icon: "🏠",
    description: "Kebutuhan rumah tangga dari perabotan hingga perlengkapan dapur",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    productCount: 124,
  },
  {
    slug: "hewan-peliharaan",
    name: "Hewan Peliharaan",
    icon: "🐾",
    description: "Makanan dan aksesoris untuk hewan kesayangan Anda",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
    productCount: 45,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
