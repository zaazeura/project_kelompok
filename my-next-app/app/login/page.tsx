"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login, register, validateEmail, validatePassword } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const passwordValidation = validatePassword(form.password);

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (form.email && !validateEmail(form.email)) {
      setError("Format email tidak valid");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setForm({ ...form, password: value });
    if (!isLogin && value.length > 0) {
      const result = validatePassword(value);
      setPasswordErrors(result.errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!form.email || !form.password) {
        setError("Email dan password harus diisi!");
        return;
      }
      if (!validateEmail(form.email)) {
        setError("Format email tidak valid");
        return;
      }
      setLoading(true);
      const result = await login(form.email, form.password);
      setLoading(false);
      if (result.success) {
        router.push("/profil");
      } else {
        setError(result.error || "Login gagal");
      }
    } else {
      if (!form.name || !form.email || !form.password) {
        setError("Semua field harus diisi!");
        return;
      }
      if (!validateEmail(form.email)) {
        setError("Format email tidak valid");
        return;
      }
      if (!passwordValidation.valid) {
        setError("Password tidak memenuhi syarat");
        return;
      }
      setLoading(true);
      const result = await register(form.name, form.email, form.password);
      setLoading(false);
      if (result.success) {
        router.push("/profil");
      } else {
        setError(result.error || "Registrasi gagal");
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setPasswordErrors([]);
    setShowPassword(false);
    setEmailTouched(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              🌿
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Masuk" : "Daftar"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin ? "Selamat datang kembali di EarthShop" : "Buat akun EarthShop Anda"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900 placeholder-gray-400"
                  placeholder="Nama lengkap"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); if (emailTouched) setError(""); }}
                onBlur={handleEmailBlur}
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition text-gray-900 placeholder-gray-400 ${
                  emailTouched && form.email && !validateEmail(form.email)
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-green-600"
                }`}
                placeholder="email@contoh.com"
              />
              {emailTouched && form.email && !validateEmail(form.email) && (
                <p className="text-xs text-red-500 mt-1">Format email tidak valid</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 transition text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {!isLogin && form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          passwordValidation.valid
                            ? "bg-green-500"
                            : passwordErrors.length <= 4 - level
                            ? "bg-yellow-400"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  {passwordErrors.map((err, i) => (
                    <p key={i} className="text-xs text-red-500">• {err}</p>
                  ))}
                  {passwordValidation.valid && (
                    <p className="text-xs text-green-600">• Password kuat</p>
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-green-700 font-medium hover:underline"
            >
              {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
