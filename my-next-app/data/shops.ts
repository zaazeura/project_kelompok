export interface Shop {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  rating: number;
  totalProducts: number;
  joinedYear: number;
}

export const shops: Shop[] = [
  {
    id: "warung-bu-sari",
    name: "Warung Bu Sari",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    description: "Warung tradisional yang menyajikan masakan rumahan dengan bahan segar pilihan.",
    location: "Jl. Merdeka No. 45, Jakarta",
    rating: 4.8,
    totalProducts: 24,
    joinedYear: 2023,
  },
  {
    id: "bakery-corner",
    name: "Bakery Corner",
    image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop",
    description: "Toko roti artisan dengan resep otentik Eropa dan bahan berkualitas tinggi.",
    location: "Jl. Sudirman No. 12, Jakarta",
    rating: 4.7,
    totalProducts: 18,
    joinedYear: 2023,
  },
  {
    id: "green-kitchen",
    name: "Green Kitchen",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop",
    description: "Restoran healthy food yang menggunakan bahan organik dari petani lokal.",
    location: "Jl. Gatot Subroto No. 78, Jakarta",
    rating: 4.9,
    totalProducts: 32,
    joinedYear: 2024,
  },
  {
    id: "coffee-bean",
    name: "Coffee Bean",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    description: "Kedai kopi specialty dengan biji kopi pilihan dari berbagai daerah Indonesia.",
    location: "Jl. Thamrin No. 23, Jakarta",
    rating: 4.6,
    totalProducts: 15,
    joinedYear: 2024,
  },
  {
    id: "pizza-delight",
    name: "Pizza Delight",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    description: "Restoran pizza Italia dengan wood-fired oven dan topping premium.",
    location: "Jl. Casablanca No. 56, Jakarta",
    rating: 4.5,
    totalProducts: 20,
    joinedYear: 2024,
  },
  {
    id: "fresh-mart",
    name: "Fresh Mart",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
    description: "Mini market modern dengan produk segar dan harga terjangkau.",
    location: "Jl. Kuningan No. 90, Jakarta",
    rating: 4.4,
    totalProducts: 42,
    joinedYear: 2023,
  },
];

export function getShopById(id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}
