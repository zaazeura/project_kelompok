"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type QueueStatus = "waiting" | "processing" | "completed" | "cancelled";

export interface QueueItem {
  id: string;
  queueNumber: number;
  userId: string;
  status: QueueStatus;
  serviceType: string;
  createdAt: string;
  startedProcessingAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  position: number;
}

interface QueueContextType {
  currentQueue: QueueItem | null;
  queuePosition: number;
  estimatedWaitMinutes: number;
  joinQueue: (serviceType: string) => QueueItem;
  leaveQueue: () => void;
  getQueueStatus: () => QueueStatus;
  getQueueNumber: () => number;
  allQueues: QueueItem[];
}

const QueueContext = createContext<QueueContextType | null>(null);

const QUEUE_KEY = "foodsaver_queue";
const QUEUE_COUNTER_KEY = "foodsaver_queue_counter";

function getStoredQueue(): QueueItem | null {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredQueue(queue: QueueItem | null) {
  if (queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } else {
    localStorage.removeItem(QUEUE_KEY);
  }
}

function getNextQueueNumber(): number {
  try {
    const raw = localStorage.getItem(QUEUE_COUNTER_KEY);
    const current = raw ? parseInt(raw) : 0;
    const next = current + 1;
    localStorage.setItem(QUEUE_COUNTER_KEY, next.toString());
    return next;
  } catch {
    localStorage.setItem(QUEUE_COUNTER_KEY, "1");
    return 1;
  }
}

function calculateEstimatedWait(queueNumber: number, currentProcessing: number): number {
  // Simulate: each order takes ~5 minutes to process
  const position = Math.max(0, queueNumber - currentProcessing);
  return position * 5;
}

// Simulated queue state
let simulatedProcessing = 1;
let simulatedCompleted = 0;

export function QueueProvider({ children }: { children: ReactNode }) {
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>(null);
  const [allQueues, setAllQueues] = useState<QueueItem[]>([]);

  // Load queue from localStorage on mount
  useEffect(() => {
    const stored = getStoredQueue();
    if (stored && stored.status !== "completed" && stored.status !== "cancelled") {
      setCurrentQueue(stored);
    }
  }, []);

  // Simulate queue processing every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQueue((prev) => {
        if (!prev) return null;

        if (prev.status === "waiting") {
          // Random chance to start processing
          if (Math.random() < 0.3) {
            const updated: QueueItem = {
              ...prev,
              status: "processing",
              startedProcessingAt: new Date().toISOString(),
            };
            saveStoredQueue(updated);
            simulatedProcessing = prev.queueNumber;
            return updated;
          }
        }

        if (prev.status === "processing") {
          // Random chance to complete
          if (Math.random() < 0.4) {
            const updated: QueueItem = {
              ...prev,
              status: "completed",
              completedAt: new Date().toISOString(),
            };
            saveStoredQueue(null);
            simulatedCompleted = prev.queueNumber;
            return null;
          }
        }

        return prev;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const joinQueue = useCallback((serviceType: string): QueueItem => {
    const queueNumber = getNextQueueNumber();
    const estimatedWait = calculateEstimatedWait(queueNumber, simulatedProcessing);

    const newQueue: QueueItem = {
      id: `Q-${Date.now().toString(36)}`,
      queueNumber,
      userId: "current-user",
      status: "waiting",
      serviceType,
      createdAt: new Date().toISOString(),
      estimatedWaitMinutes: estimatedWait,
      position: queueNumber - simulatedCompleted,
    };

    setCurrentQueue(newQueue);
    saveStoredQueue(newQueue);
    setAllQueues((prev) => [...prev, newQueue]);

    return newQueue;
  }, []);

  const leaveQueue = useCallback(() => {
    if (currentQueue) {
      setAllQueues((prev) =>
        prev.map((q) =>
          q.id === currentQueue.id ? { ...q, status: "cancelled" as QueueStatus } : q
        )
      );
    }
    setCurrentQueue(null);
    saveStoredQueue(null);
  }, [currentQueue]);

  const getQueueStatus = useCallback((): QueueStatus => {
    return currentQueue?.status || "waiting";
  }, [currentQueue]);

  const getQueueNumber = useCallback((): number => {
    return currentQueue?.queueNumber || 0;
  }, [currentQueue]);

  const queuePosition = currentQueue ? Math.max(0, currentQueue.queueNumber - simulatedCompleted) : 0;
  const estimatedWaitMinutes = queuePosition * 5;

  return (
    <QueueContext.Provider
      value={{
        currentQueue,
        queuePosition,
        estimatedWaitMinutes,
        joinQueue,
        leaveQueue,
        getQueueStatus,
        getQueueNumber,
        allQueues,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
}
