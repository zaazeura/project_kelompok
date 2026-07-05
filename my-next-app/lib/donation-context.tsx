"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Donation {
  id: string;
  programId: number;
  programTitle: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  message: string;
  date: string;
  status: "success" | "pending" | "failed";
  receiptId: string;
}

interface DonationContextType {
  donations: Donation[];
  makeDonation: (data: {
    programId: number;
    programTitle: string;
    amount: number;
    donorName: string;
    donorEmail: string;
    message: string;
  }) => Donation;
  getDonationsByProgram: (programId: number) => Donation[];
  getDonationById: (id: string) => Donation | undefined;
  getTotalDonated: () => number;
  getRecentDonations: (limit?: number) => Donation[];
}

const DonationContext = createContext<DonationContextType | null>(null);

function generateReceiptId(): string {
  return `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

function generateDonationId(): string {
  return `DN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function DonationProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>([]);

  const makeDonation = useCallback(
    (data: {
      programId: number;
      programTitle: string;
      amount: number;
      donorName: string;
      donorEmail: string;
      message: string;
    }) => {
      const donation: Donation = {
        id: generateDonationId(),
        programId: data.programId,
        programTitle: data.programTitle,
        amount: data.amount,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        message: data.message,
        date: new Date().toISOString(),
        status: "success",
        receiptId: generateReceiptId(),
      };

      setDonations((prev) => [donation, ...prev]);
      return donation;
    },
    []
  );

  const getDonationsByProgram = useCallback(
    (programId: number) => donations.filter((d) => d.programId === programId),
    [donations]
  );

  const getDonationById = useCallback(
    (id: string) => donations.find((d) => d.id === id),
    [donations]
  );

  const getTotalDonated = useCallback(
    () => donations.reduce((sum, d) => sum + d.amount, 0),
    [donations]
  );

  const getRecentDonations = useCallback(
    (limit = 5) => donations.slice(0, limit),
    [donations]
  );

  return (
    <DonationContext.Provider
      value={{
        donations,
        makeDonation,
        getDonationsByProgram,
        getDonationById,
        getTotalDonated,
        getRecentDonations,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
}
