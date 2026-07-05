import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { ReviewProvider } from "@/lib/review-context";
import { AuthProvider } from "@/lib/auth-context";
import { NotifProvider } from "@/lib/notif-context";
import { HistoryProvider } from "@/lib/history-context";
import { DonationProvider } from "@/lib/donation-context";
import { CourierProvider } from "@/lib/courier-context";
import { DigitalPaymentProvider } from "@/lib/digital-payment-context";
import { ExpiryProvider } from "@/lib/expiry-context";

export const metadata: Metadata = {
  title: "EarthShop - Belanja Ramah Lingkungan",
  description: "Platform marketplace ramah lingkungan untuk kebutuhan sehari-hari tanpa plastik dengan harga terjangkau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ReviewProvider>
                <NotifProvider>
                  <HistoryProvider>
                    <DonationProvider>
                      <CourierProvider>
                        <DigitalPaymentProvider>
                          <ExpiryProvider>{children}</ExpiryProvider>
                        </DigitalPaymentProvider>
                      </CourierProvider>
                    </DonationProvider>
                  </HistoryProvider>
                </NotifProvider>
              </ReviewProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
