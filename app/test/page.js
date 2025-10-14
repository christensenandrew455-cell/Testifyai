import Link from "next/link";

export default function Test() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center text-gray-900">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-blue-600 text-lg font-semibold hover:underline">
          ← Back
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-blue-600 mb-6">TestifyAI</h1>

      {/* Prompt Input */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2">
        <label className="block text-lg font-semibold mb-2">
          Pick a noun / proper noun / subject / anything you want to be tested on
        </label>
        <input
          type="text"
          placeholder="Example: Physics, Dogs, World War II..."
          className="w-full border border-gray-300 rounded-lg p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Difficulty Slider */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3">Difficulty Level</label>
          <input
            type="range"
            min="1"
            max="9"
            defaultValue="5"
            step="1"
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-sm mt-1 text-gray-700">
            <span>1 — Beginner</span>
            <span>5 — Apprentice</span>
            <span>9 — Master</span>
          </div>
        </div>

        {/* Number of Questions */}
        <div className="flex items-center justify-between mb-6">
          <label className="text-lg font-semibold">Number of Questions:</label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 10"
            className="border border-gray-300 rounded-lg p-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Generate Test Button */}
        <div className="flex justify-end">
          <Link href="/test-chat">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
              Generate Test
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
