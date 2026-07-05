"use client";

import { useState } from "react";
import { useMarketplace, type MarketplaceIntegration } from "@/lib/marketplace-context";
import { formatRupiah } from "@/lib/format";
import Toast from "./Toast";

export default function MarketplaceDashboard() {
  const { integrations, connectPlatform, disconnectPlatform, exportOrders, syncOrders, orders } = useMarketplace();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleConnect = (platform: string) => {
    connectPlatform(platform);
    setToast({ message: `${platform} berhasil terhubung!`, type: "success" });
  };

  const handleDisconnect = (platform: string) => {
    disconnectPlatform(platform);
    setToast({ message: `${platform} telah diputuskan`, type: "success" });
  };

  const handleExport = (platform?: string) => {
    const csv = exportOrders(platform);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${platform || "all"}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: "Export berhasil!", type: "success" });
  };

  const handleSync = (platform: string) => {
    syncOrders(platform);
    setToast({ message: `${platform} berhasil disinkronkan!`, type: "success" });
  };

  const connectedCount = integrations.filter((i) => i.isConnected).length;
  const totalOrders = orders.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Platform Terhubung</p>
          <p className="text-2xl font-bold text-green-700">{connectedCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Pesanan</p>
          <p className="text-2xl font-bold text-blue-700">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Penjualan</p>
          <p className="text-2xl font-bold text-purple-700">
            {formatRupiah(orders.reduce((sum, o) => sum + o.total, 0))}
          </p>
        </div>
      </div>

      {/* Platform List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Platform Marketplace</h3>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className={`p-4 rounded-xl border-2 ${
                integration.isConnected ? "border-green-200 bg-green-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.platformIcon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{integration.platform}</p>
                    <p className="text-sm text-gray-500">
                      {integration.isConnected
                        ? `Terhubung • ${integration.ordersCount} pesanan`
                        : "Belum terhubung"}
                    </p>
                    {integration.lastSync && (
                      <p className="text-xs text-gray-400">
                        Sync terakhir: {new Date(integration.lastSync).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {integration.isConnected ? (
                    <>
                      <button
                        onClick={() => handleSync(integration.platform)}
                        className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        Sync
                      </button>
                      <button
                        onClick={() => handleExport(integration.platform)}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        Export
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration.platform)}
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        Putuskan
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.platform)}
                      className="px-4 py-1.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                    >
                      Hubungkan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleExport()}
          className="w-full mt-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
        >
          Export Semua Pesanan (CSV)
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
