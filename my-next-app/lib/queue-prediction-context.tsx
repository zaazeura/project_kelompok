"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface HourlyData {
  hour: number;
  avgWaitMinutes: number;
  avgQueueLength: number;
  totalTransactions: number;
}

interface PredictionResult {
  predictedWaitMinutes: number;
  confidence: number;
  busyLevel: "low" | "medium" | "high" | "very_high";
  recommendation: string;
  bestTimeToVisit: string;
  historicalData: HourlyData[];
}

interface QueuePredictionContextType {
  getPrediction: (serviceType: string) => PredictionResult;
  getHourlyData: (serviceType: string) => HourlyData[];
  getBestTime: (serviceType: string) => string;
  getBusyLevel: (serviceType: string, hour?: number) => "low" | "medium" | "high" | "very_high";
}

const QueuePredictionContext = createContext<QueuePredictionContextType | null>(null);

// Simulated historical data
const historicalData: Record<string, HourlyData[]> = {
  "Checkout": [
    { hour: 8, avgWaitMinutes: 2, avgQueueLength: 3, totalTransactions: 45 },
    { hour: 9, avgWaitMinutes: 5, avgQueueLength: 8, totalTransactions: 78 },
    { hour: 10, avgWaitMinutes: 8, avgQueueLength: 12, totalTransactions: 95 },
    { hour: 11, avgWaitMinutes: 12, avgQueueLength: 18, totalTransactions: 120 },
    { hour: 12, avgWaitMinutes: 15, avgQueueLength: 22, totalTransactions: 135 },
    { hour: 13, avgWaitMinutes: 18, avgQueueLength: 25, totalTransactions: 142 },
    { hour: 14, avgWaitMinutes: 14, avgQueueLength: 20, totalTransactions: 128 },
    { hour: 15, avgWaitMinutes: 10, avgQueueLength: 15, totalTransactions: 105 },
    { hour: 16, avgWaitMinutes: 8, avgQueueLength: 12, totalTransactions: 88 },
    { hour: 17, avgWaitMinutes: 12, avgQueueLength: 18, totalTransactions: 115 },
    { hour: 18, avgWaitMinutes: 15, avgQueueLength: 22, totalTransactions: 130 },
    { hour: 19, avgWaitMinutes: 10, avgQueueLength: 15, totalTransactions: 98 },
  ],
  "default": [
    { hour: 8, avgWaitMinutes: 3, avgQueueLength: 2, totalTransactions: 30 },
    { hour: 9, avgWaitMinutes: 5, avgQueueLength: 5, totalTransactions: 55 },
    { hour: 10, avgWaitMinutes: 8, avgQueueLength: 8, totalTransactions: 72 },
    { hour: 11, avgWaitMinutes: 10, avgQueueLength: 12, totalTransactions: 90 },
    { hour: 12, avgWaitMinutes: 12, avgQueueLength: 15, totalTransactions: 105 },
    { hour: 13, avgWaitMinutes: 14, avgQueueLength: 18, totalTransactions: 115 },
    { hour: 14, avgWaitMinutes: 10, avgQueueLength: 12, totalTransactions: 88 },
    { hour: 15, avgWaitMinutes: 8, avgQueueLength: 10, totalTransactions: 75 },
    { hour: 16, avgWaitMinutes: 6, avgQueueLength: 8, totalTransactions: 62 },
    { hour: 17, avgWaitMinutes: 10, avgQueueLength: 14, totalTransactions: 95 },
    { hour: 18, avgWaitMinutes: 12, avgQueueLength: 16, totalTransactions: 108 },
    { hour: 19, avgWaitMinutes: 8, avgQueueLength: 10, totalTransactions: 78 },
  ],
};

function getBusyLevel(waitMinutes: number): "low" | "medium" | "high" | "very_high" {
  if (waitMinutes <= 5) return "low";
  if (waitMinutes <= 10) return "medium";
  if (waitMinutes <= 15) return "high";
  return "very_high";
}

function getBusyLevelColor(level: "low" | "medium" | "high" | "very_high"): string {
  switch (level) {
    case "low": return "text-green-600";
    case "medium": return "text-yellow-600";
    case "high": return "text-orange-600";
    case "very_high": return "text-red-600";
  }
}

function getRecommendation(level: "low" | "medium" | "high" | "very_high"): string {
  switch (level) {
    case "low": return "Waktu yang tepat untuk berbelanja! Antrian sangat sepi.";
    case "medium": return "Antrian cukup ramai. Siapkan waktu sedikit ekstra.";
    case "high": return "Antrian ramai. Pertimbangkan untuk datang di waktu lain.";
    case "very_high": return "Antrian sangat ramai. Disarankan datang di jam lain.";
  }
}

export function QueuePredictionProvider({ children }: { children: ReactNode }) {
  const getHourlyData = useCallback((serviceType: string): HourlyData[] => {
    return historicalData[serviceType] || historicalData["default"];
  }, []);

  const getPrediction = useCallback((serviceType: string): PredictionResult => {
    const data = historicalData[serviceType] || historicalData["default"];
    const now = new Date();
    const currentHour = now.getHours();

    // Find current hour data or closest
    const currentData = data.find((d) => d.hour === currentHour) || data[0];

    // Add some randomness for simulation
    const variance = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const predictedWait = Math.round(currentData.avgWaitMinutes * variance);
    const confidence = 75 + Math.floor(Math.random() * 20); // 75-95%

    const busyLevel = getBusyLevel(predictedWait);
    const recommendation = getRecommendation(busyLevel);

    // Find best time (lowest wait)
    const bestData = data.reduce((best, curr) =>
      curr.avgWaitMinutes < best.avgWaitMinutes ? curr : best
    );
    const bestTimeToVisit = `${bestData.hour.toString().padStart(2, "0")}:00`;

    return {
      predictedWaitMinutes: predictedWait,
      confidence,
      busyLevel,
      recommendation,
      bestTimeToVisit,
      historicalData: data,
    };
  }, []);

  const getBestTime = useCallback((serviceType: string): string => {
    const data = historicalData[serviceType] || historicalData["default"];
    const best = data.reduce((b, curr) =>
      curr.avgWaitMinutes < b.avgWaitMinutes ? curr : b
    );
    return `${best.hour.toString().padStart(2, "0")}:00`;
  }, []);

  const getBusyLevelForTime = useCallback((serviceType: string, hour?: number): "low" | "medium" | "high" | "very_high" => {
    const data = historicalData[serviceType] || historicalData["default"];
    const targetHour = hour ?? new Date().getHours();
    const hourData = data.find((d) => d.hour === targetHour) || data[0];
    return getBusyLevel(hourData.avgWaitMinutes);
  }, []);

  return (
    <QueuePredictionContext.Provider value={{ getPrediction, getHourlyData, getBestTime, getBusyLevel: getBusyLevelForTime }}>
      {children}
    </QueuePredictionContext.Provider>
  );
}

export function useQueuePrediction() {
  const context = useContext(QueuePredictionContext);
  if (!context) {
    throw new Error("useQueuePrediction must be used within a QueuePredictionProvider");
  }
  return context;
}

export { getBusyLevelColor };
