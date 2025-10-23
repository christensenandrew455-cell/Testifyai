"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 text-gray-900 px-6">
      {/* Logo / Title */}
      <h1 className="text-5xl font-extrabold text-blue-600 mb-6">TestifyAI</h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-md">
        Generate custom quizzes on any topic — fast, fun, and AI-powered.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/test"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition text-center"
        >
          Take a Test
        </Link>

        <Link
          href="/about"
          className="bg-white border border-blue-600 text-blue-600 font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-blue-50 transition text-center"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
