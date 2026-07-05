export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}jt`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}rb`;
  }
  return num.toString();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleDateString("id-ID", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
}

export function isFreshProductStillGood(bestBefore: string): boolean {
  return new Date(bestBefore) > new Date();
}
