"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

function ResultsInner() {
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
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafc] text-gray-900 text-center px-6 py-10"
      style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}
    >
      <div className="max-w-lg w-full bg-white border-4 border-blue-600 rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-4">
          Your Results
        </h1>

        <div className="mb-6">
          <p className="text-2xl font-bold mb-2 text-gray-800">
            Score: {score} / {total}
          </p>
          <p className="text-xl text-blue-600 font-semibold mb-4">
            {percent}%
          </p>
          <p className="text-lg text-gray-700">{getMessage()}</p>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/test">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition">
              Try Again
            </button>
          </Link>

          <Link href="/">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition">
              Home
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-sm font-semibold text-blue-600">
        TheTestifyAI
      </div>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsInner />
    </Suspense>
  );
}
