"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, isLoggedIn, updateUser, logout, changePassword, validatePassword } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Semua field harus diisi");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Password baru tidak cocok");
      return;
    }

    const validation = validatePassword(passwordForm.newPassword);
    if (!validation.valid) {
      setPasswordError(validation.errors.join(", "));
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    setPasswordLoading(false);

    if (result.success) {
      setPasswordSuccess("Password berhasil diubah");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => { setShowChangePassword(false); setPasswordSuccess(""); }, 2000);
    } else {
      setPasswordError(result.error || "Gagal mengubah password");
    }
  };

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
            <p className="text-green-100 text-sm">Pengguna FoodSaver</p>
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
                onClick={() => {
                  setForm({ name: user.name, email: user.email, phone: user.phone, address: user.address });
                  setEditing(true);
                }}
                className="flex-1 py-2.5 border-2 border-green-700 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition"
              >
                Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                🔒
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Ubah Password</h3>
                <p className="text-xs text-gray-500">Perbarui password akun Anda</p>
              </div>
            </div>
            <span className="text-gray-400">{showChangePassword ? "▲" : "▼"}</span>
          </button>

          {showChangePassword && (
            <div className="px-6 pb-6 border-t">
              {passwordError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                  {passwordSuccess}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-3 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {passwordLoading ? "Memproses..." : "Ubah Password"}
                </button>
              </form>
            </div>
          )}
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
