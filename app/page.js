import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center text-gray-900">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to TestifyAI</h1>
      <p className="text-gray-800 mb-6 text-center">
        For all your testing needs — fueled by AI.
      </p>

      <Link href="/test">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Test Me
        </button>
      </Link>
    </div>
  );
}
