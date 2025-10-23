"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 text-center text-gray-900">
      {/* Header */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-2">
        Welcome to TestifyAI
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-700 mb-10">
        For all your testing needs — fueled by AI.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/test"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-md shadow-md transition-all duration-200 text-lg"
        >
          Test Me
        </Link>

        <Link
          href="/about"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-md shadow-md transition-all duration-200 text-lg"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
