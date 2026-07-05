"use client";

import { useCourier, type DeliveryTracking as TrackingType, type CourierStatus } from "@/lib/courier-context";

interface DeliveryTrackingProps {
  orderId: number;
}

function getStatusColor(status: CourierStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "picked_up":
      return "bg-blue-100 text-blue-800";
    case "in_transit":
      return "bg-purple-100 text-purple-800";
    case "arriving":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-green-100 text-green-800";
  }
}

function getStatusIcon(status: CourierStatus): string {
  switch (status) {
    case "pending":
      return "⏳";
    case "picked_up":
      return "📦";
    case "in_transit":
      return "🚚";
    case "arriving":
      return "📍";
    case "delivered":
      return "✅";
  }
}

function getStatusProgress(status: CourierStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "picked_up":
      return 25;
    case "in_transit":
      return 50;
    case "arriving":
      return 75;
    case "delivered":
      return 100;
  }
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function DeliveryTrackingDisplay({ orderId }: DeliveryTrackingProps) {
  const { getDeliveryTracking } = useCourier();
  const tracking = getDeliveryTracking(orderId);

  if (!tracking) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-gray-500">Belum ada pengiriman aktif</p>
      </div>
    );
  }

  const progress = getStatusProgress(tracking.status);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Status Pengiriman</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tracking.status)}`}>
          {getStatusIcon(tracking.status)} {tracking.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Dipesan</span>
          <span>Dijemput</span>
          <span>Dalam Perjalanan</span>
          <span>Hampir Tiba</span>
          <span>Diterima</span>
        </div>
      </div>

      {/* Courier Info */}
      {tracking.courier && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
          <img
            src={tracking.courier.photo}
            alt={tracking.courier.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-bold text-gray-900">{tracking.courier.name}</p>
            <p className="text-sm text-gray-500">{tracking.courier.vehicle}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-yellow-600">⭐ {tracking.courier.rating}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">{tracking.courier.plateNumber}</span>
            </div>
          </div>
          <a
            href={`tel:${tracking.courier.phone}`}
            className="p-3 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
          >
            📞
          </a>
        </div>
      )}

      {/* Estimated Arrival */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl mb-4">
        <div>
          <p className="text-sm text-gray-500">Estimasi Kedatangan</p>
          <p className="text-lg font-bold text-blue-700">
            {tracking.status === "delivered" ? "Tiba" : formatTime(tracking.estimatedArrival)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Jarak</p>
          <p className="font-bold text-gray-900">{tracking.distance} km</p>
        </div>
      </div>

      {/* Tracking History */}
      <div className="mt-4">
        <h4 className="font-medium text-gray-900 mb-3">Riwayat Pengiriman</h4>
        <div className="space-y-3">
          {tracking.trackingHistory.slice().reverse().map((event, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getStatusColor(event.status)}`}>
                {getStatusIcon(event.status)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{event.description}</p>
                <p className="text-sm text-gray-500">{event.location}</p>
                <p className="text-xs text-gray-400">{formatTime(event.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
