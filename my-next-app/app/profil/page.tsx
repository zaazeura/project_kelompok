"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, isLoggedIn, updateUser, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  if (!isLoggedIn || !user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Belum Masuk</h1>
          <p className="text-gray-500 mb-6">Silakan masuk untuk melihat profil Anda.</p>
          <a
            href="/login"
            className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
          >
            Masuk Sekarang
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-green-700 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-white text-green-700 flex items-center justify-center text-3xl font-bold mx-auto mb-3 border-4 border-green-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-green-100 text-sm">Pengguna EarthShop</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg flex-shrink-0">
                ✉️
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Email</div>
                {editing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-sm"
                  />
                ) : (
                  <div className="text-gray-800">{user.email}</div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg flex-shrink-0">
                📞
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Nomor Telepon</div>
                {editing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-sm"
                  />
                ) : (
                  <div className="text-gray-800">{user.phone || "-"}</div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg flex-shrink-0">
                📍
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Alamat</div>
                {editing ? (
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-sm"
                  />
                ) : (
                  <div className="text-gray-800">{user.address || "-"}</div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={() => { updateUser(form); setEditing(false); }}
                  className="flex-1 py-2.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex-1 py-2.5 border-2 border-green-700 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition"
              >
                Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* Google Maps Lokasi */}
        {user.address && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-900">📍 Lokasi Saya</h3>
              <p className="text-xs text-gray-500 mt-1">{user.address}</p>
            </div>
            <div className="relative w-full h-64">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.940639384798!2d106.82278277475549!3d-6.208763493794348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15963a6e2e3%3A0x5c70c5c8f3e7c8e7!2s${encodeURIComponent(user.address)}!5e0!3m2!1sid!2sid!4v1720000000000!5m2!1sid!2sid`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>
        )}

        {/* Total Donasi */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">
              🎁
            </div>
            <h3 className="font-bold text-gray-900">Total Donasi Saya</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700">12</div>
              <div className="text-xs text-gray-500 mt-1">Total Donasi</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">Rp 450K</div>
              <div className="text-xs text-gray-500 mt-1">Total Nominal</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-500 mt-1">Program Diikuti</div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <Footer />
    </main>
  );
}
