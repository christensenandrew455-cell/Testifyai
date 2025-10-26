"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900 text-center">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold text-blue-700 mb-3">TheTestifyAI</h1>
        <p className="text-lg text-gray-700 mb-10 max-w-md">
          For all your testing needs — powered by AI precision.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <Link
            href="/test"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-xl transition text-lg text-center w-full sm:w-auto"
          >
            Test Me
          </Link>

          <Link
            href="/learn"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-xl transition text-lg text-center w-full sm:w-auto"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
