"use client";

import { useTrustScore, type TrustScore } from "@/lib/trust-score-context";

interface TrustScoreDisplayProps {
  productId: number;
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBgColor(score: number): string {
  if (score >= 85) return "bg-green-100";
  if (score >= 70) return "bg-yellow-100";
  return "bg-red-100";
}

function getBarColor(score: number): string {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-yellow-500";
  return "bg-red-500";
}

export default function TrustScoreDisplay({ productId }: TrustScoreDisplayProps) {
  const { getTrustScore } = useTrustScore();
  const trustScore = getTrustScore(productId);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Skor Kepercayaan</h3>

      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(trustScore.overall)}`}>
          <span className={`text-3xl font-bold ${getScoreColor(trustScore.overall)}`}>
            {trustScore.overall}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">dari 100</p>
      </div>

      {/* Badges */}
      {trustScore.badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {trustScore.badges.map((badge) => (
            <span
              key={badge.id}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
              title={badge.description}
            >
              <span>{badge.icon}</span>
              <span>{badge.name}</span>
            </span>
          ))}
        </div>
      )}

      {/* Breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Rincian Skor</h4>

        {[
          { label: "Rating Produk", score: trustScore.breakdown.rating },
          { label: "Ulasan Pembeli", score: trustScore.breakdown.reviews },
          { label: "Jumlah Terjual", score: trustScore.breakdown.sales },
          { label: "Kepercayaan Penjual", score: trustScore.breakdown.seller },
          { label: "Tingkat Pengembalian", score: trustScore.breakdown.returnRate },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className={`font-medium ${getScoreColor(item.score)}`}>{item.score}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getBarColor(item.score)}`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Verification */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          {trustScore.verification.isVerified ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-gray-400">○</span>
          )}
          <span className="font-medium text-gray-900">
            {trustScore.verification.isVerified ? "Terverifikasi" : "Belum Terverifikasi"}
          </span>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>📍 {trustScore.verification.location}</p>
          <p>⚡ Waktu Respon: {trustScore.verification.responseTime}</p>
          <p>📦 Tingkat Penyelesaian: {trustScore.verification.completionRate}%</p>
        </div>
      </div>
    </div>
  );
}
