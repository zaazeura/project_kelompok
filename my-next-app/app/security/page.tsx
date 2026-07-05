"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) return `${hours}j ${remainingMinutes}m`;
  return `${remainingMinutes}m`;
}

function getEventIcon(type: string): string {
  switch (type) {
    case "login": return "🔑";
    case "logout": return "🚪";
    case "password_change": return "🔒";
    case "lockout": return "⛔";
    case "session_timeout": return "⏰";
    default: return "📋";
  }
}

function getEventColor(type: string): string {
  switch (type) {
    case "login": return "bg-green-100 text-green-800";
    case "logout": return "bg-gray-100 text-gray-800";
    case "password_change": return "bg-blue-100 text-blue-800";
    case "lockout": return "bg-red-100 text-red-800";
    case "session_timeout": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default function SecurityPage() {
  const { user, isLoggedIn, getSecurityEvents, getSessionTimeRemaining } = useAuth();
  const [events, setEvents] = useState<ReturnType<typeof getSecurityEvents>>([]);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    setEvents(getSecurityEvents());
    const interval = setInterval(() => {
      setSessionTime(getSessionTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getSecurityEvents, getSessionTimeRemaining]);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-500 mb-6">Silakan login terlebih dahulu.</p>
          <Link href="/login" className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition">
            Login
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const recentEvents = events.slice(-20).reverse();
  const loginCount = events.filter((e) => e.type === "login" && e.details?.includes("Success")).length;
  const failedCount = events.filter((e) => e.type === "login" && e.details?.includes("Failed")).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Keamanan Akun</h1>

        {/* Session Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Sesi Aktif</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-bold text-green-700">Aktif</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Sisa Waktu</p>
              <p className="text-lg font-bold text-blue-700">{formatDuration(sessionTime)}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">User</p>
              <p className="text-lg font-bold text-purple-700">{user?.email}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Sesi akan berakhir otomatis setelah 30 menit tidak ada aktivitas.
          </p>
        </div>

        {/* Security Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Statistik Keamanan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">{loginCount}</p>
              <p className="text-sm text-gray-500">Login Berhasil</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-red-600">{failedCount}</p>
              <p className="text-sm text-gray-500">Login Gagal</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{events.length}</p>
              <p className="text-sm text-gray-500">Total Aktivitas</p>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Fitur Keamanan Aktif</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-500">Logout otomatis setelah 30 menit tidak aktif</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-gray-900">Brute Force Protection</p>
                <p className="text-sm text-gray-500">Akun terkunci setelah 5x login gagal (15 menit)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-gray-900">Password Hashing</p>
                <p className="text-sm text-gray-500">SHA-256 dengan salt untuk keamanan password</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-gray-900">Activity Logging</p>
                <p className="text-sm text-gray-500">Semua aktivitas keamanan tercatat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Aktivitas Terbaru</h3>
          {recentEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada aktivitas</p>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xl">{getEventIcon(event.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventColor(event.type)}`}>
                        {event.type.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">{formatTime(event.timestamp)}</span>
                    </div>
                    {event.details && (
                      <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
