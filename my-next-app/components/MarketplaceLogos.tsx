export function TokopediaLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#42B549" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold" fontFamily="Arial">T</text>
    </svg>
  );
}

export function ShopeeLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#EE4D2D" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold" fontFamily="Arial">S</text>
    </svg>
  );
}

export function LazadaLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#0F146D" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold" fontFamily="Arial">L</text>
    </svg>
  );
}

export function TiktokShopLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#000000" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold" fontFamily="Arial">♪</text>
    </svg>
  );
}

export function BukalapakLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#E31E52" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold" fontFamily="Arial">B</text>
    </svg>
  );
}

export function BlibliLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#006CB7" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold" fontFamily="Arial">B</text>
    </svg>
  );
}

export function GrabFoodLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#00B14F" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold" fontFamily="Arial">G</text>
    </svg>
  );
}

export function GoFoodLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#00AA13" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold" fontFamily="Arial">Go</text>
    </svg>
  );
}

export const MARKETPLACE_CONFIG: Record<string, { color: string; hoverColor: string; label: string; Logo: React.ComponentType<{ size?: number }> }> = {
  tokopedia: { color: "bg-[#42B549]", hoverColor: "hover:bg-[#3a9e41]", label: "Tokopedia", Logo: TokopediaLogo },
  shopee: { color: "bg-[#EE4D2D]", hoverColor: "hover:bg-[#d6432a]", label: "Shopee", Logo: ShopeeLogo },
  lazada: { color: "bg-[#0F146D]", hoverColor: "hover:bg-[#0c105a]", label: "Lazada", Logo: LazadaLogo },
  tiktokshop: { color: "bg-black", hoverColor: "hover:bg-gray-800", label: "TikTok Shop", Logo: TiktokShopLogo },
  bukalapak: { color: "bg-[#E31E52]", hoverColor: "hover:bg-[#c91a48]", label: "Bukalapak", Logo: BukalapakLogo },
  blibli: { color: "bg-[#006CB7]", hoverColor: "hover:bg-[#005a99]", label: "Blibli", Logo: BlibliLogo },
  grabfood: { color: "bg-[#00B14F]", hoverColor: "hover:bg-[#009a44]", label: "GrabFood", Logo: GrabFoodLogo },
  gofood: { color: "bg-[#00AA13]", hoverColor: "hover:bg-[#009511]", label: "GoFood", Logo: GoFoodLogo },
};
