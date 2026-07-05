"use client";

import { useState } from "react";
import { useQueue } from "@/lib/queue-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QueueDisplay from "@/components/QueueDisplay";
import Toast from "@/components/Toast";

const SERVICES = [
  { id: "checkout", label: "Checkout", icon: "🛒", description: "Antri untuk proses checkout" },
  { id: "pickup", label: "Ambil Barang", icon: "📦", description: "Antri untuk pengambilan barang" },
  { id: "return", label: "Retur/Komplain", icon: "🔄", description: "Antri untuk layanan retur" },
  { id: "info", label: "Informasi", icon: "ℹ️", description: "Antri untuk bertanya informasi" },
];

export default function QueuePage() {
  const { currentQueue, joinQueue } = useQueue();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleJoinQueue = () => {
    if (!selectedService) {
      setToast("Pilih jenis layanan terlebih dahulu");
      return;
    }

    const service = SERVICES.find((s) => s.id === selectedService);
    if (service) {
      joinQueue(service.label);
      setToast(`Berhasil masuk antrian ${service.label}!`);
      setSelectedService(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistem Antrian</h1>
        <p className="text-gray-500 mb-6">Pilih layanan dan masuk antrian secara online</p>

        {/* Current Queue Status */}
        {currentQueue && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Status Antrian Anda</h3>
            <QueueDisplay />
          </div>
        )}

        {/* Service Selection */}
        {!currentQueue && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Pilih Layanan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    selectedService === service.id
                      ? "border-green-700 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{service.label}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleJoinQueue}
              disabled={!selectedService}
              className="w-full mt-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Masuk Antrian
            </button>
          </div>
        )}

        {/* Queue Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Informasi Antrian</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">⏱️</span>
              <div>
                <p className="font-medium text-gray-900">Estimasi Waktu</p>
                <p className="text-sm text-gray-500">Setiap antrian diperkirakan 5 menit per pesanan</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📱</span>
              <div>
                <p className="font-medium text-gray-900">Notifikasi</p>
                <p className="text-sm text-gray-500">Anda akan diberi tahu saat giliran Anda tiba</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">❌</span>
              <div>
                <p className="font-medium text-gray-900">Pembatalan</p>
                <p className="text-sm text-gray-500">Anda dapat keluar dari antrian kapan saja</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </main>
  );
}
