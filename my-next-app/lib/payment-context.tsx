"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface PaymentTransaction {
  id: string;
  orderId: number;
  amount: number;
  method: string;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string;
  expiresAt: string;
}

interface PaymentContextType {
  transactions: PaymentTransaction[];
  createTransaction: (orderId: number, amount: number, method: string) => PaymentTransaction;
  confirmPayment: (transactionId: string) => boolean;
  failPayment: (transactionId: string) => void;
  getTransaction: (transactionId: string) => PaymentTransaction | undefined;
  getTransactionsByOrder: (orderId: number) => PaymentTransaction[];
  verifyAmount: (transactionId: string, expectedAmount: number) => boolean;
  isDuplicatePayment: (orderId: number) => boolean;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${random}`.toUpperCase();
}

function getExpirationTime(): string {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return expires.toISOString();
}

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  const createTransaction = useCallback((orderId: number, amount: number, method: string) => {
    const transaction: PaymentTransaction = {
      id: generateTransactionId(),
      orderId,
      amount,
      method,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: getExpirationTime(),
    };
    setTransactions((prev) => [...prev, transaction]);
    return transaction;
  }, []);

  const confirmPayment = useCallback((transactionId: string) => {
    let success = false;
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId && t.status === "pending") {
          success = true;
          return { ...t, status: "paid" as PaymentStatus, paidAt: new Date().toISOString() };
        }
        return t;
      })
    );
    return success;
  }, []);

  const failPayment = useCallback((transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId ? { ...t, status: "failed" as PaymentStatus } : t
      )
    );
  }, []);

  const getTransaction = useCallback(
    (transactionId: string) => transactions.find((t) => t.id === transactionId),
    [transactions]
  );

  const getTransactionsByOrder = useCallback(
    (orderId: number) => transactions.filter((t) => t.orderId === orderId),
    [transactions]
  );

  const verifyAmount = useCallback(
    (transactionId: string, expectedAmount: number) => {
      const txn = transactions.find((t) => t.id === transactionId);
      return txn ? txn.amount === expectedAmount : false;
    },
    [transactions]
  );

  const isDuplicatePayment = useCallback(
    (orderId: number) => {
      return transactions.some(
        (t) => t.orderId === orderId && (t.status === "paid" || t.status === "pending")
      );
    },
    [transactions]
  );

  return (
    <PaymentContext.Provider
      value={{
        transactions,
        createTransaction,
        confirmPayment,
        failPayment,
        getTransaction,
        getTransactionsByOrder,
        verifyAmount,
        isDuplicatePayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
