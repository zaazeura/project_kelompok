import { donations } from "@/data/donations";
import DonationDetailClient from "./DonationDetailClient";

export function generateStaticParams() {
  return donations.map((d) => ({ id: String(d.id) }));
}

export default function DonationDetailPage() {
  return <DonationDetailClient />;
}
