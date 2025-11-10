"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [numQuestions, setNumQuestions] = useState(5);
  const [testType, setTestType] = useState("multiple-choice");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return alert("Please enter a topic.");

    setLoading(true);

    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          numQuestions,
          testType,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate test");

      // 🔁 Go to controller to structure and route test
      const controllerRes = await fetch("/test/controller.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const finalTest = await controllerRes.json();
      if (!controllerRes.ok) throw new Error(finalTest.error);

      // ✅ Send structured test data to /test page
      router.push("/test");
    } catch (err) {
      console.error("❌ Error generating test:", err);
      alert("There was an error generating the test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl w-[400px] text-center backdrop-blur-md">
        <h1 className="text-2xl mb-6 font-semibold text-white">Topic</h1>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter any topic — broad or specific"
          className="w-full p-2 rounded-md text-black mb-4"
        />

        <label className="block text-sm mb-2 text-gray-200">
          Difficulty Scale
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full mb-4"
        />

        <label className="block text-sm mb-2 text-gray-200">
          Number of Questions
        </label>
        <input
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          className="w-full p-2 rounded-md text-black mb-6"
          min="1"
          max="20"
        />

        <h2 className="mb-2 text-gray-200 text-sm">Test Type</h2>
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setTestType("multiple-choice")}
            className={`px-3 py-1 rounded-md border transition-all ${
              testType === "multiple-choice"
                ? "bg-blue-500 border-blue-300 text-white"
                : "bg-transparent border-gray-400 text-gray-200 hover:bg-gray-700"
            }`}
          >
            Multiple Choice
          </button>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all"
        >
          {loading ? "Generating..." : "Generate Test"}
        </button>
      </div>
    </div>
  );
}
