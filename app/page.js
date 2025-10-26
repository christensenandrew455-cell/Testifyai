"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center text-gray-900 bg-gradient-to-r from-blue-500 to-orange-400">
      <div className="flex flex-col items-center space-y-6 px-6">
        {/* Title */}
        <h1 className="text-5xl font-bold text-white drop-shadow-md">
          Welcome to TestifyAI
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-white/90 max-w-md">
          For all your testing needs — powered by AI precision.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 pt-4">
          <Link
            href="/test"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-xl transition text-lg text-center shadow-md"
          >
            Test Me
          </Link>

          <Link
            href="/learn"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-xl transition text-lg text-center shadow-md"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
