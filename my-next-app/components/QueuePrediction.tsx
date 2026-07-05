"use client";

import { useQueuePrediction, getBusyLevelColor } from "@/lib/queue-prediction-context";

interface QueuePredictionProps {
  serviceType: string;
  showChart?: boolean;
}

export default function QueuePrediction({ serviceType, showChart = false }: QueuePredictionProps) {
  const { getPrediction, getBestTime } = useQueuePrediction();
  const prediction = getPrediction(serviceType);
  const bestTime = getBestTime(serviceType);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Prediksi Antrian</h3>

      {/* Main Prediction */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold mb-2 ${getBusyLevelColor(prediction.busyLevel)}`}>
          {prediction.predictedWaitMinutes} menit
        </div>
        <p className="text-gray-500">Estimasi waktu tunggu</p>
        <p className="text-sm text-gray-400 mt-1">Tingkat kepercayaan: {prediction.confidence}%</p>
      </div>

      {/* Busy Level Badge */}
      <div className="flex justify-center mb-6">
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
          prediction.busyLevel === "low" ? "bg-green-100 text-green-800" :
          prediction.busyLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
          prediction.busyLevel === "high" ? "bg-orange-100 text-orange-800" :
          "bg-red-100 text-red-800"
        }`}>
          {prediction.busyLevel === "low" ? "🟢 Sepi" :
           prediction.busyLevel === "medium" ? "🟡 Ramai" :
           prediction.busyLevel === "high" ? "🟠 Sangat Ramai" :
           "🔴 Penuh"}
        </span>
      </div>

      {/* Recommendation */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-700">{prediction.recommendation}</p>
      </div>

      {/* Best Time */}
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl mb-4">
        <span className="text-sm text-gray-600">Waktu terbaik untuk datang:</span>
        <span className="font-bold text-green-700">{bestTime}</span>
      </div>

      {/* Hourly Chart */}
      {showChart && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Statistik per Jam</h4>
          <div className="space-y-2">
            {prediction.historicalData.map((data) => (
              <div key={data.hour} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12">{data.hour.toString().padStart(2, "0")}:00</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      data.avgWaitMinutes <= 5 ? "bg-green-500" :
                      data.avgWaitMinutes <= 10 ? "bg-yellow-500" :
                      data.avgWaitMinutes <= 15 ? "bg-orange-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, (data.avgWaitMinutes / 20) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{data.avgWaitMinutes} mnt</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
