"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold hover:border-green-600 hover:text-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-12 text-center font-semibold text-lg">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold hover:border-green-600 hover:text-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}
