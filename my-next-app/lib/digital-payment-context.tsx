"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type PaymentMethod = "qris" | "va_bca" | "va_mandiri" | "va_bri" | "va_bni" | "gopay" | "ovo" | "dana" | "shopeepay";

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: string;
  category: "qris" | "va" | "ewallet";
  accountNumber?: string;
  accountName?: string;
  instructions: string[];
}

export interface QRCodeData {
  id: string;
  amount: number;
  merchantName: string;
  qrString: string;
  expiresAt: string;
}

export interface VirtualAccountData {
  accountNumber: string;
  bankName: string;
  accountName: string;
  amount: number;
  expiresAt: string;
}

interface DigitalPaymentContextType {
  paymentOptions: PaymentOption[];
  getPaymentOption: (id: PaymentMethod) => PaymentOption | undefined;
  generateQRCode: (amount: number, merchantName: string) => QRCodeData;
  generateVirtualAccount: (bank: string, amount: number) => VirtualAccountData;
  getPaymentOptionsByCategory: (category: "qris" | "va" | "ewallet") => PaymentOption[];
}

const DigitalPaymentContext = createContext<DigitalPaymentContextType | null>(null);

const paymentOptions: PaymentOption[] = [
  // QRIS
  {
    id: "qris",
    name: "QRIS",
    icon: "📱",
    category: "qris",
    instructions: [
      "Buka aplikasi mobile banking atau e-wallet Anda",
      "Pilih menu QRIS atau Scan QR",
      "Scan QR Code yang ditampilkan",
      "Konfirmasi pembayaran",
      "Tunggu konfirmasi berhasil",
    ],
  },
  // Virtual Account
  {
    id: "va_bca",
    name: "Virtual Account BCA",
    icon: "🏦",
    category: "va",
    accountNumber: "1234567890",
    accountName: "FoodSaver Indonesia",
    instructions: [
      "Buka aplikasi BCA mobile atau KlikBCA",
      "Pilih menu Transfer > Virtual Account",
      "Masukkan nomor Virtual Account",
      "Masukkan jumlah pembayaran",
      "Konfirmasi dan selesaikan transfer",
    ],
  },
  {
    id: "va_mandiri",
    name: "Virtual Account Mandiri",
    icon: "🏦",
    category: "va",
    accountNumber: "9876543210",
    accountName: "FoodSaver Indonesia",
    instructions: [
      "Buka aplikasi Mandiri Online",
      "Pilih menu Bayar > Virtual Account",
      "Masukkan nomor Virtual Account",
      "Konfirmasi jumlah pembayaran",
      "Selesaikan pembayaran",
    ],
  },
  {
    id: "va_bri",
    name: "Virtual Account BRI",
    icon: "🏦",
    category: "va",
    accountNumber: "5555666677",
    accountName: "FoodSaver Indonesia",
    instructions: [
      "Buka aplikasi BRImo",
      "Pilih menu Transfer > BRIVA",
      "Masukkan nomor BRIVA",
      "Masukkan jumlah pembayaran",
      "Konfirmasi pembayaran",
    ],
  },
  {
    id: "va_bni",
    name: "Virtual Account BNI",
    icon: "🏦",
    category: "va",
    accountNumber: "8888999900",
    accountName: "FoodSaver Indonesia",
    instructions: [
      "Buka aplikasi BNI Mobile Banking",
      "Pilih menu Transfer > Virtual Account",
      "Masukkan nomor Virtual Account",
      "Konfirmasi jumlah",
      "Selesaikan transfer",
    ],
  },
  // E-Wallet
  {
    id: "gopay",
    name: "GoPay",
    icon: "💚",
    category: "ewallet",
    instructions: [
      "Buka aplikasi Gojek",
      "Pilih GoPay",
      "Pilih Bayar atau Scan QR",
      "Scan QR Code atau masukkan kode",
      "Konfirmasi pembayaran",
    ],
  },
  {
    id: "ovo",
    name: "OVO",
    icon: "💜",
    category: "ewallet",
    instructions: [
      "Buka aplikasi OVO",
      "Pilih menu QR Code",
      "Scan QR Code yang ditampilkan",
      "Masukkan PIN OVO",
      "Konfirmasi pembayaran",
    ],
  },
  {
    id: "dana",
    name: "Dana",
    icon: "💙",
    category: "ewallet",
    instructions: [
      "Buka aplikasi Dana",
      "Pilih Bayar",
      "Scan QR Code",
      "Konfirmasi jumlah pembayaran",
      "Masukkan PIN",
    ],
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    icon: "🧡",
    category: "ewallet",
    instructions: [
      "Buka aplikasi Shopee",
      "Pilih ShopeePay",
      "Pilih Scan",
      "Scan QR Code",
      "Konfirmasi pembayaran",
    ],
  },
];

function generateQRString(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateVANumber(): string {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i < 15) result += " ";
  }
  return result;
}

export function DigitalPaymentProvider({ children }: { children: ReactNode }) {
  const getPaymentOption = useCallback((id: PaymentMethod) => {
    return paymentOptions.find((opt) => opt.id === id);
  }, []);

  const getPaymentOptionsByCategory = useCallback((category: "qris" | "va" | "ewallet") => {
    return paymentOptions.filter((opt) => opt.category === category);
  }, []);

  const generateQRCode = useCallback((amount: number, merchantName: string): QRCodeData => {
    return {
      id: `QR-${Date.now().toString(36)}`,
      amount,
      merchantName,
      qrString: generateQRString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    };
  }, []);

  const generateVirtualAccount = useCallback((bank: string, amount: number): VirtualAccountData => {
    const option = paymentOptions.find(
      (opt) => opt.category === "va" && opt.name.toLowerCase().includes(bank.toLowerCase())
    );
    return {
      accountNumber: option?.accountNumber || generateVANumber(),
      bankName: bank.toUpperCase(),
      accountName: option?.accountName || "FoodSaver Indonesia",
      amount,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
  }, []);

  return (
    <DigitalPaymentContext.Provider
      value={{ paymentOptions, getPaymentOption, generateQRCode, generateVirtualAccount, getPaymentOptionsByCategory }}
    >
      {children}
    </DigitalPaymentContext.Provider>
  );
}

export function useDigitalPayment() {
  const context = useContext(DigitalPaymentContext);
  if (!context) {
    throw new Error("useDigitalPayment must be used within a DigitalPaymentProvider");
  }
  return context;
}
