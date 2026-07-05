"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface MarketplaceOrder {
  id: string;
  platform: string;
  orderId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceIntegration {
  id: string;
  platform: string;
  platformIcon: string;
  isConnected: boolean;
  connectedAt?: string;
  ordersCount: number;
  lastSync?: string;
}

interface MarketplaceContextType {
  integrations: MarketplaceIntegration[];
  orders: MarketplaceOrder[];
  connectPlatform: (platform: string) => void;
  disconnectPlatform: (platform: string) => void;
  getOrdersByPlatform: (platform: string) => MarketplaceOrder[];
  exportOrders: (platform?: string) => string;
  syncOrders: (platform: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

const platforms: MarketplaceIntegration[] = [
  { id: "tokopedia", platform: "Tokopedia", platformIcon: "🟢", isConnected: false, ordersCount: 0 },
  { id: "shopee", platform: "Shopee", platformIcon: "🟠", isConnected: false, ordersCount: 0 },
  { id: "bukalapak", platform: "Bukalapak", platformIcon: "🔴", isConnected: false, ordersCount: 0 },
  { id: "blibli", platform: "Blibli", platformIcon: "🔵", isConnected: false, ordersCount: 0 },
  { id: "lazada", platform: "Lazada", platformIcon: "🟣", isConnected: false, ordersCount: 0 },
];

function generateOrderId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

function generateOrders(platform: string, count: number): MarketplaceOrder[] {
  const statuses: MarketplaceOrder["status"][] = ["pending", "processing", "shipped", "delivered"];
  const orders: MarketplaceOrder[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const created = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const qty = Math.floor(Math.random() * 3) + 1;
    const price = Math.floor(Math.random() * 50000) + 10000;

    orders.push({
      id: `mp-${platform}-${i}`,
      platform,
      orderId: generateOrderId(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: [
        {
          name: `Produk ${platform} #${i + 1}`,
          quantity: qty,
          price,
        },
      ],
      total: qty * price,
      createdAt: created.toISOString(),
      updatedAt: new Date(created.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return orders;
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<MarketplaceIntegration[]>(platforms);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);

  const connectPlatform = useCallback((platform: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.platform.toLowerCase() === platform.toLowerCase()
          ? { ...i, isConnected: true, connectedAt: new Date().toISOString(), ordersCount: Math.floor(Math.random() * 10) + 1 }
          : i
      )
    );

    // Generate some orders
    const newOrders = generateOrders(platform, Math.floor(Math.random() * 5) + 2);
    setOrders((prev) => [...prev, ...newOrders]);
  }, []);

  const disconnectPlatform = useCallback((platform: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.platform.toLowerCase() === platform.toLowerCase()
          ? { ...i, isConnected: false, connectedAt: undefined, ordersCount: 0, lastSync: undefined }
          : i
      )
    );
    setOrders((prev) => prev.filter((o) => o.platform.toLowerCase() !== platform.toLowerCase()));
  }, []);

  const getOrdersByPlatform = useCallback(
    (platform: string) => orders.filter((o) => o.platform.toLowerCase() === platform.toLowerCase()),
    [orders]
  );

  const exportOrders = useCallback(
    (platform?: string) => {
      const filteredOrders = platform
        ? orders.filter((o) => o.platform.toLowerCase() === platform.toLowerCase())
        : orders;

      const csvHeader = "Order ID,Platform,Status,Items,Total,Created At\n";
      const csvRows = filteredOrders
        .map(
          (o) =>
            `"${o.orderId}","${o.platform}","${o.status}","${o.items.map((i) => `${i.name} x${i.quantity}`).join("; ")}",${o.total},"${new Date(o.createdAt).toLocaleDateString("id-ID")}"`
        )
        .join("\n");

      return csvHeader + csvRows;
    },
    [orders]
  );

  const syncOrders = useCallback(
    (platform: string) => {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.platform.toLowerCase() === platform.toLowerCase()
            ? { ...i, lastSync: new Date().toISOString() }
            : i
        )
      );
    },
    []
  );

  return (
    <MarketplaceContext.Provider
      value={{ integrations, orders, connectPlatform, disconnectPlatform, getOrdersByPlatform, exportOrders, syncOrders }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
}
