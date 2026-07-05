"use client";

import { useQueue, type QueueStatus } from "@/lib/queue-context";

interface QueueDisplayProps {
  showActions?: boolean;
}

function getStatusColor(status: QueueStatus): string {
  switch (status) {
    case "waiting":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusIcon(status: QueueStatus): string {
  switch (status) {
    case "waiting":
      return "⏳";
    case "processing":
      return "🔄";
    case "completed":
      return "✅";
    case "cancelled":
      return "❌";
  }
}

function getStatusText(status: QueueStatus): string {
  switch (status) {
    case "waiting":
      return "Menunggu";
    case "processing":
      return "Diproses";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
  }
}

export default function QueueDisplay({ showActions = true }: QueueDisplayProps) {
  const { currentQueue, queuePosition, estimatedWaitMinutes, leaveQueue } = useQueue();

  if (!currentQueue) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-gray-500">Anda tidak dalam antrian</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 border-2 ${getStatusColor(currentQueue.status)}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getStatusIcon(currentQueue.status)}</span>
          <div>
            <p className="text-sm opacity-75">Nomor Antrian</p>
            <p className="text-3xl font-bold">#{currentQueue.queueNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-75">Status</p>
          <p className="font-bold">{getStatusText(currentQueue.status)}</p>
        </div>
      </div>

      {currentQueue.status === "waiting" && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="opacity-75">Posisi dalam antrian</span>
            <span className="font-bold">{queuePosition}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="opacity-75">Estimasi waktu tunggu</span>
            <span className="font-bold">{estimatedWaitMinutes} menit</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-2">
            <div
              className="bg-current h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(10, 100 - queuePosition * 10)}%` }}
            />
          </div>
        </div>
      )}

      {currentQueue.status === "processing" && (
        <div className="bg-white/50 rounded-xl p-3 mt-3">
          <p className="text-sm">Pesanan Anda sedang diproses. Silakan tunggu sebentar.</p>
        </div>
      )}

      {showActions && currentQueue.status === "waiting" && (
        <button
          onClick={leaveQueue}
          className="w-full mt-4 py-2 border-2 border-current rounded-xl font-medium hover:bg-white/50 transition"
        >
          Keluar dari Antrian
        </button>
      )}
    </div>
  );
}
