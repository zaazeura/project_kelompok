"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useNotifications } from "@/lib/notif-context";
import { useAuth } from "@/lib/auth-context";
import { navCategories } from "@/data/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Makanan & Minuman");
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-green-700 flex items-center gap-1">
            <span>🌍</span> EarthShop
          </Link>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Beranda
            </Link>
            <Link href="/produk" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Produk
            </Link>
            <Link href="/kategori" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Kategori
            </Link>
            <Link href="/donasi" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Donasi
            </Link>
            <Link href="/tentang" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Tentang
            </Link>
            <Link href="/kontak" className="text-sm font-medium text-gray-700 hover:text-green-700 transition">
              Kontak
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/produk?search="
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-green-600 hover:text-white transition"
            >
              🔍
            </Link>
            <Link
              href="/wishlist"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-green-600 hover:text-white transition relative"
            >
              ♡
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/notifikasi"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-green-600 hover:text-white transition relative"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/keranjang"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm hover:bg-green-600 hover:text-white transition relative"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {/* Profile Icon */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold hover:bg-green-800 transition"
              >
                {isLoggedIn && user ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
              {showProfile && (
                <div className="absolute right-0 top-10 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-5 z-50">
                  {isLoggedIn && user ? (
                    <>
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                        <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center text-lg font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <Link href="/profil" onClick={() => setShowProfile(false)} className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition">
                          👤 Profil Saya
                        </Link>
                        <Link href="/riwayat" onClick={() => setShowProfile(false)} className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition">
                          📋 Riwayat Belanja
                        </Link>
                        <Link href="/wishlist" onClick={() => setShowProfile(false)} className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition">
                          ♡ Wishlist
                        </Link>
                        <Link href="/notifikasi" onClick={() => setShowProfile(false)} className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition">
                          🔔 Notifikasi
                        </Link>
                      </div>
                      <button
                        onClick={() => { logout(); setShowProfile(false); }}
                        className="block w-full text-center py-2.5 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-4 pb-4 border-b">
                        <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-lg font-bold mx-auto mb-2">
                          ?
                        </div>
                        <div className="font-semibold text-gray-900">Belum Masuk</div>
                        <div className="text-xs text-gray-500">Masuk untuk akses semua fitur</div>
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setShowProfile(false)}
                        className="block w-full text-center py-2.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition mb-2"
                      >
                        Masuk / Daftar
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            className="md:hidden text-xl p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Category Strip */}
      <div className="fixed top-14 left-0 right-0 bg-white border-b z-40 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex gap-2 py-2.5">
          {navCategories.map((c) => (
            <Link
              key={c.name}
              href={`/kategori/${c.slug}`}
              onClick={() => setActive(c.name)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                active === c.name
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-white border-b shadow-lg z-50">
          <div className="p-4 space-y-3">
            <Link href="/" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Beranda
            </Link>
            <Link href="/produk" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Produk
            </Link>
            <Link href="/kategori" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Kategori
            </Link>
            <Link href="/donasi" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Donasi
            </Link>
            <Link href="/tentang" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Tentang
            </Link>
            <Link href="/kontak" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
              Kontak
            </Link>
            <div className="border-t pt-3">
              <Link href="/keranjang" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
                🛒 Keranjang {totalItems > 0 && `(${totalItems})`}
              </Link>
              <Link href="/wishlist" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
                ♡ Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link href="/notifikasi" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
                🔔 Notifikasi {unreadCount > 0 && `(${unreadCount})`}
              </Link>
              <Link href="/profil" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
                👤 Profil Saya
              </Link>
              <Link href="/riwayat" className="block py-2 text-gray-800 font-medium" onClick={() => setOpen(false)}>
                📋 Riwayat Belanja
              </Link>
              {!isLoggedIn && (
                <Link href="/login" className="block py-2 text-green-700 font-semibold" onClick={() => setOpen(false)}>
                  🔑 Masuk / Daftar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
