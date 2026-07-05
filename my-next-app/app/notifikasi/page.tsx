"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNotifications } from "@/lib/notif-context";

export default function NotifikasiPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua sudah dibaca"}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-xl hover:bg-green-100 transition"
              >
                Tandai Semua Dibaca
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"
              >
                Hapus Semua
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Notifikasi</h2>
            <p className="text-gray-500">Notifikasi baru akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`bg-white rounded-2xl p-4 shadow-sm cursor-pointer transition hover:shadow-md ${
                  !notif.read ? "border-l-4 border-green-600" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{notif.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold text-sm ${!notif.read ? "text-gray-900" : "text-gray-600"}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
