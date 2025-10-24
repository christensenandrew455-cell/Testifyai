"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-3">TestifyAI</h1>
      <p className="text-lg text-gray-700 mb-8">
        For all your testing needs — fueled by AI
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/test" className="inline-block w-full sm:w-auto">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition text-lg w-full">
            Test Me
          </button>
        </Link>

        <Link href="/learn" className="inline-block w-full sm:w-auto">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition text-lg w-full">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
