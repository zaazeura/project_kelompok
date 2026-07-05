"use client";

import { useState, useCallback } from "react";

interface DeliveryMapProps {
  address: string;
  onAddressChange: (address: string) => void;
}

const BALIKPAPAN_CENTER = { lat: -1.2379, lng: 116.8529 };

const AREA_BOUNDARIES = {
  north: -1.15,
  south: -1.32,
  east: 116.95,
  west: 116.75,
};

const POPULAR_LOCATIONS = [
  { name: "Kota Balikpapan", lat: -1.2379, lng: 116.8529 },
  { name: "Balikpapan Selatan", lat: -1.2650, lng: 116.8400 },
  { name: "Balikpapan Utara", lat: -1.2100, lng: 116.8600 },
  { name: "Balikpapan Barat", lat: -1.2500, lng: 116.8000 },
  { name: "Balikpapan Timur", lat: -1.2300, lng: 116.9000 },
  { name: "Balikpapan Tengah", lat: -1.2450, lng: 116.8500 },
];

export default function DeliveryMap({ address, onAddressChange }: DeliveryMapProps) {
  const [selectedLocation, setSelectedLocation] = useState(POPULAR_LOCATIONS[0]);
  const [isInArea, setIsInArea] = useState(true);
  const [showMap, setShowMap] = useState(true);

  const checkDeliveryArea = useCallback((lat: number, lng: number) => {
    return (
      lat >= AREA_BOUNDARIES.south &&
      lat <= AREA_BOUNDARIES.north &&
      lng >= AREA_BOUNDARIES.west &&
      lng <= AREA_BOUNDARIES.east
    );
  }, []);

  const handleLocationSelect = (location: typeof POPULAR_LOCATIONS[0]) => {
    setSelectedLocation(location);
    const inArea = checkDeliveryArea(location.lat, location.lng);
    setIsInArea(inArea);
    onAddressChange(`${location.name}, Balikpapan`);
  };

  const handleAddressInput = (value: string) => {
    onAddressChange(value);
  };

  const getMapUrl = () => {
    const lat = selectedLocation.lat;
    const lng = selectedLocation.lng;
    const zoom = 13;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}%2C${lng}!5e0!3m2!1sid!2sid!4v1720000000000!5m2!1sid!2sid`;
  };

  const getDirectionsUrl = () => {
    const lat = selectedLocation.lat;
    const lng = selectedLocation.lng;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">📍</span>
          Lokasi Pengiriman
        </h3>
        <button
          onClick={() => setShowMap(!showMap)}
          className="text-sm text-green-700 font-medium hover:underline"
        >
          {showMap ? "Sembunyikan Peta" : "Tampilkan Peta"}
        </button>
      </div>

      {/* Address Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat Lengkap
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => handleAddressInput(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition"
          placeholder="Masukkan alamat pengiriman"
        />
      </div>

      {/* Quick Location Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Lokasi Cepat
        </label>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => handleLocationSelect(loc)}
              className={`px-3 py-2 text-sm rounded-xl border-2 transition ${
                selectedLocation.name === loc.name
                  ? "border-green-700 bg-green-50 text-green-800"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Area Status */}
      <div className={`p-3 rounded-xl mb-4 ${
        isInArea ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
      }`}>
        <div className="flex items-center gap-2">
          <span className={isInArea ? "text-green-600" : "text-red-600"}>
            {isInArea ? "✅" : "❌"}
          </span>
          <span className={`text-sm font-medium ${
            isInArea ? "text-green-800" : "text-red-800"
          }`}>
            {isInArea
              ? "Lokasi Anda berada dalam area pengiriman Balikpapan"
              : "Lokasi Anda di luar area pengiriman"}
          </span>
        </div>
        {!isInArea && (
          <p className="text-xs text-red-600 mt-1 ml-6">
            Pengiriman hanya tersedia untuk area Balikpapan. Silakan pilih "Ambil di Toko".
          </p>
        )}
      </div>

      {/* Google Maps Embed */}
      {showMap && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
          <iframe
            src={getMapUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
          {/* Map Overlay */}
          <div className="absolute bottom-2 left-2 right-2 flex gap-2">
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white rounded-lg shadow-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-1"
            >
              <span>🗺️</span>
              Buka di Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Selected Location Info */}
      <div className="bg-gray-50 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{selectedLocation.name}</p>
            <p className="text-xs text-gray-500">
              Koordinat: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Estimasi Pengiriman</p>
            <p className="text-sm font-bold text-green-700">30-45 menit</p>
          </div>
        </div>
      </div>

      {/* Delivery Radius Info */}
      <div className="mt-3 text-xs text-gray-500">
        <p>Radius pengiriman: 15 km dari pusat kota</p>
        <p className="mt-1">
          <a
            href="https://www.google.com/maps/@-1.2379,116.8529,13z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:underline"
          >
            Lihat peta area pengiriman
          </a>
        </p>
      </div>
    </div>
  );
}
