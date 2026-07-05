"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type CourierStatus = "pending" | "picked_up" | "in_transit" | "arriving" | "delivered";

export interface Courier {
  id: string;
  name: string;
  vehicle: string;
  plateNumber: string;
  rating: number;
  totalDeliveries: number;
  photo: string;
  phone: string;
}

export interface DeliveryTracking {
  orderId: number;
  courier: Courier | null;
  status: CourierStatus;
  estimatedArrival: string;
  actualArrival?: string;
  trackingHistory: TrackingEvent[];
  distance: number;
  currentLocation?: string;
}

export interface TrackingEvent {
  status: CourierStatus;
  timestamp: string;
  location: string;
  description: string;
}

interface CourierContextType {
  couriers: Courier[];
  activeDeliveries: DeliveryTracking[];
  selectCourier: (orderId: number, courierId: string) => DeliveryTracking;
  getDeliveryTracking: (orderId: number) => DeliveryTracking | undefined;
  updateDeliveryStatus: (orderId: number, status: CourierStatus) => void;
  getCourierById: (id: string) => Courier | undefined;
}

const CourierContext = createContext<CourierContextType | null>(null);

const couriers: Courier[] = [
  {
    id: "c1",
    name: "Andi Pratama",
    vehicle: "Motor Honda Vario",
    plateNumber: "B 1234 ABC",
    rating: 4.9,
    totalDeliveries: 1250,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    phone: "081234567890",
  },
  {
    id: "c2",
    name: "Siti Rahayu",
    vehicle: "Motor Yamaha NMAX",
    plateNumber: "B 5678 DEF",
    rating: 4.8,
    totalDeliveries: 980,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    phone: "081234567891",
  },
  {
    id: "c3",
    name: "Budi Santoso",
    vehicle: "Mobil Toyota Avanza",
    plateNumber: "B 9012 GHI",
    rating: 4.7,
    totalDeliveries: 2100,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    phone: "081234567892",
  },
  {
    id: "c4",
    name: "Dewi Lestari",
    vehicle: "Motor Honda Beat",
    plateNumber: "B 3456 JKL",
    rating: 4.9,
    totalDeliveries: 750,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    phone: "081234567893",
  },
];

function getStatusDescription(status: CourierStatus): string {
  switch (status) {
    case "pending": return "Menunggu kurir";
    case "picked_up": return "Barang diambil kurir";
    case "in_transit": return "Dalam perjalanan";
    case "arriving": return "Kurir hampir tiba";
    case "delivered": return "Barang telah diterima";
  }
}

function getEstimatedMinutes(status: CourierStatus, distance: number): number {
  const baseTime = distance * 3; // 3 minutes per km
  switch (status) {
    case "pending": return baseTime + 10;
    case "picked_up": return baseTime + 5;
    case "in_transit": return Math.max(5, baseTime - 5);
    case "arriving": return 5;
    case "delivered": return 0;
  }
}

export function CourierProvider({ children }: { children: ReactNode }) {
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryTracking[]>([]);

  const selectCourier = useCallback((orderId: number, courierId: string): DeliveryTracking => {
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier) throw new Error("Courier not found");

    const distance = 2 + Math.random() * 8; // 2-10 km
    const tracking: DeliveryTracking = {
      orderId,
      courier,
      status: "pending",
      estimatedArrival: new Date(Date.now() + getEstimatedMinutes("pending", distance) * 60000).toISOString(),
      trackingHistory: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          location: "FoodSaver Warehouse",
          description: "Pesanan sedang menunggu kurir",
        },
      ],
      distance: Math.round(distance * 10) / 10,
      currentLocation: "FoodSaver Warehouse",
    };

    setActiveDeliveries((prev) => [...prev, tracking]);
    return tracking;
  }, []);

  const getDeliveryTracking = useCallback(
    (orderId: number) => activeDeliveries.find((d) => d.orderId === orderId),
    [activeDeliveries]
  );

  const updateDeliveryStatus = useCallback((orderId: number, status: CourierStatus) => {
    setActiveDeliveries((prev) =>
      prev.map((d) => {
        if (d.orderId !== orderId) return d;

        const locations = ["FoodSaver Warehouse", "Jl. Sudirman", "Jl. Gatot Subroto", "Jl. Thamrin", "Tujuan Pengiriman"];
        const locationIndex = Math.min(
          locations.length - 1,
          Math.floor(((status === "delivered" ? 4 : status === "arriving" ? 3 : status === "in_transit" ? 2 : status === "picked_up" ? 1 : 0) / 4) * (locations.length - 1))
        );

        const newEvent: TrackingEvent = {
          status,
          timestamp: new Date().toISOString(),
          location: locations[locationIndex],
          description: getStatusDescription(status),
        };

        return {
          ...d,
          status,
          currentLocation: locations[locationIndex],
          actualArrival: status === "delivered" ? new Date().toISOString() : undefined,
          estimatedArrival: status === "delivered"
            ? d.actualArrival || new Date().toISOString()
            : new Date(Date.now() + getEstimatedMinutes(status, d.distance) * 60000).toISOString(),
          trackingHistory: [...d.trackingHistory, newEvent],
        };
      })
    );
  }, []);

  const getCourierById = useCallback((id: string) => couriers.find((c) => c.id === id), []);

  // Simulate delivery progress every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDeliveries((prev) =>
        prev.map((d) => {
          if (d.status === "delivered" || d.status === "pending") return d;

          const nextStatus: Record<CourierStatus, CourierStatus> = {
            pending: "picked_up",
            picked_up: "in_transit",
            in_transit: "arriving",
            arriving: "delivered",
            delivered: "delivered",
          };

          if (Math.random() < 0.3) {
            const newStatus = nextStatus[d.status];
            const locations = ["FoodSaver Warehouse", "Jl. Sudirman", "Jl. Gatot Subroto", "Jl. Thamrin", "Tujuan Pengiriman"];
            const statusOrder: CourierStatus[] = ["pending", "picked_up", "in_transit", "arriving", "delivered"];
            const locationIndex = Math.min(
              locations.length - 1,
              Math.floor((statusOrder.indexOf(newStatus) / 4) * (locations.length - 1))
            );

            return {
              ...d,
              status: newStatus,
              currentLocation: locations[locationIndex],
              actualArrival: newStatus === "delivered" ? new Date().toISOString() : undefined,
              trackingHistory: [
                ...d.trackingHistory,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  location: locations[locationIndex],
                  description: getStatusDescription(newStatus),
                },
              ],
            };
          }
          return d;
        })
      );
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CourierContext.Provider
      value={{ couriers, activeDeliveries, selectCourier, getDeliveryTracking, updateDeliveryStatus, getCourierById }}
    >
      {children}
    </CourierContext.Provider>
  );
}

export function useCourier() {
  const context = useContext(CourierContext);
  if (!context) {
    throw new Error("useCourier must be used within a CourierProvider");
  }
  return context;
}
