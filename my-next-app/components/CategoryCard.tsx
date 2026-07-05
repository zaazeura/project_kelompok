import Link from "next/link";
import type { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/kategori/${category.slug}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
        <div className="h-32 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        </div>
        <div className="p-3 text-center">
          <span className="text-lg">{category.icon}</span>
          <div className="text-sm font-semibold text-gray-800 mt-1">{category.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{category.productCount} produk</div>
        </div>
      </div>
    </Link>
  );
}
