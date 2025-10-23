"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic first!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          numQuestions,
        }),
      });

      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        localStorage.setItem("testQuestions", JSON.stringify(data.questions));
        router.push("/testchat");
      } else {
        alert("Failed to generate questions. Try again!");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-6 text-gray-900">
      {/* LOGO */}
      <h1 className="text-3xl font-bold text-blue-600 mb-8">TestifyAI</h1>

      {/* Main Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-11/12 sm:w-2/3 lg:w-1/2 space-y-6">

        {/* TOPIC */}
        <div>
          <label className="block text-lg font-semibold mb-2">1️⃣ Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type your topic... (e.g. Space, History, Biology)"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* DIFFICULTY */}
        <div>
          <label className="block text-lg font-semibold mb-2">2️⃣ Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* NUMBER OF QUESTIONS */}
        <div>
          <label className="block text-lg font-semibold mb-2">3️⃣ Number of Questions</label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
          >
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* SUMMARY */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold mb-2">🧠 Summary</h2>
          <ul className="space-y-1 text-gray-700">
            <li>
              <strong>Topic:</strong>{" "}
              {topic ? topic : <span className="text-gray-400 italic">Not set</span>}
            </li>
            <li>
              <strong>Difficulty:</strong>{" "}
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </li>
            <li>
              <strong>Questions:</strong> {numQuestions}
            </li>
          </ul>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3 mt-2 rounded-xl font-semibold text-white transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Test"}
        </button>
      </div>
    </div>
  );
}
