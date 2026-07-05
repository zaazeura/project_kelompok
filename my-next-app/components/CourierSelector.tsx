"use client";

import { useState } from "react";
import { useCourier, type Courier } from "@/lib/courier-context";
import Toast from "./Toast";

interface CourierSelectorProps {
  onSelect: (courierId: string) => void;
}

export default function CourierSelector({ onSelect }: CourierSelectorProps) {
  const { couriers } = useCourier();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSelect = () => {
    if (!selectedId) {
      setToast("Pilih kurir terlebih dahulu");
      return;
    }
    onSelect(selectedId);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Pilih Kurir</h3>

      <div className="space-y-3 mb-4">
        {couriers.map((courier) => (
          <label
            key={courier.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
              selectedId === courier.id
                ? "border-green-700 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="courier"
              value={courier.id}
              checked={selectedId === courier.id}
              onChange={(e) => setSelectedId(e.target.value)}
              className="accent-green-700"
            />
            <img
              src={courier.photo}
              alt={courier.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-gray-900">{courier.name}</p>
              <p className="text-sm text-gray-500">{courier.vehicle} • {courier.plateNumber}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-yellow-600">⭐ {courier.rating}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">{courier.totalDeliveries} pengiriman</span>
              </div>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handleSelect}
        disabled={!selectedId}
        className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Pilih Kurir Ini
      </button>

      {toast && <Toast message={toast} type="info" onClose={() => setToast(null)} />}
    </div>
  );
}
