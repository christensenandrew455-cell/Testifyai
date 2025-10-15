"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResultsPage() {
  const params = useSearchParams();
  const score = params.get("score");
  const total = params.get("total");

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center text-gray-900 p-6">
      <div className="absolute top-4 left-4">
        <Link href="/test" className="text-blue-600 text-lg font-semibold hover:underline">
          ← Retake Test
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-green-700 mb-4">Your Results</h1>
      <p className="text-lg text-gray-800 mb-6">
        You scored <span className="font-semibold text-blue-600">{score}</span> out of{" "}
        <span className="font-semibold text-blue-600">{total}</span>
      </p>

      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
