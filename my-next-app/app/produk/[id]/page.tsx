import { products } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
