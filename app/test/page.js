"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
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
          numQuestions: 5,
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
      <h1 className="text-3xl font-bold text-blue-600 mb-4">TestifyAI</h1>
      <div className="bg-white shadow-md rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2">
        <label className="block text-lg font-semibold mb-2">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Space, History, or Biology"
          className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold mb-2">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Test"}
        </button>
      </div>
    </div>
  );
}
