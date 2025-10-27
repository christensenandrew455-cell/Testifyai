"use client";

import Link from "next/link";

export default function LearnMorePage() {
  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-b from-orange-50 to-white text-gray-900 px-6 py-12"
      style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}
    >
      <div className="bg-white shadow-lg rounded-3xl border border-orange-100 p-10 max-w-3xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
          TheTestifyAI
        </h1>
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Learn More
        </h2>

        <div className="text-gray-700 leading-relaxed space-y-5 text-justify">
          <p>
            <strong>TheTestifyAI</strong> is designed for phones, computers, and
            tablets, allowing you to test yourself on any topic you choose. You
            can adjust both the difficulty and the number of questions to fit
            your learning style.
          </p>

          <p>
            Each test is created by AI — it studies your topic, generates clear
            and relevant questions, and gives you four possible answers, only
            one of which is correct. After each question, you’ll see a short
            explanation that helps you understand the reasoning behind the
            correct answer.
          </p>

          <p>
            Because questions are AI-generated, there may occasionally be small
            mistakes. If you notice any issues or have feedback, please contact
            us at:
          </p>

          <p className="font-semibold text-blue-700 text-center">
            thetestifyai@gmail.com
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-xl transition text-lg shadow-sm"
          >
            Home
          </Link>
        </div>

        <div className="mt-10 text-gray-500 text-sm italic">
          More updates coming soon — stay tuned for new features and improved
          learning tools.
        </div>
      </div>
    </div>
  );
}
