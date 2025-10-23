"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center text-gray-900">
      <h1 className="text-4xl font-bold text-blue-700 mb-3">TestifyAI</h1>
      <p className="text-lg text-gray-700 mb-8">
        For all your testing needs — fueled by AI
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/test"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition text-lg"
        >
          Test Me
        </Link>

        <Link
          href="/learn"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition text-lg"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
