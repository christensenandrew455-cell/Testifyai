"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic"; // 👈 prevents prerender error on Vercel

export default function Results() {
  const searchParams = useSearchParams();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const s = parseInt(searchParams.get("score")) || 0;
    const t = parseInt(searchParams.get("total")) || 0;
    setScore(s);
    setTotal(t);
  }, [searchParams]);

  const percent = total > 0 ? ((score / total) * 100).toFixed(0) : 0;

  const getMessage = () => {
    if (percent >= 90) return "🔥 Master Level! Excellent job!";
    if (percent >= 70) return "💪 Great work! You’re learning fast.";
    if (percent >= 50) return "🧠 Not bad — keep studying!";
    return "📘 Keep going — you’ll improve!";
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center text-gray-900 text-center p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Your Results</h1>

      <div className="bg-white shadow-md rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2 mb-6">
        <p className="text-2xl font-semibold mb-2">
          Score: {score} / {total}
        </p>
        <p className="text-xl text-gray-700 mb-4">{percent}%</p>
        <p className="text-lg">{getMessage()}</p>
      </div>

      <div className="flex space-x-4">
        <Link href="/test">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
            Try Again
          </button>
        </Link>

        <Link href="/">
          <button className="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl font-semibold hover:bg-gray-300 transition">
            Home
          </button>
        </Link>
      </div>
    </div>
  );
}
