"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [answerCounts, setAnswerCounts] = useState({
    multipleChoice: 4,
    multiSelect: 5,
  });
  const [typeQuestions, setTypeQuestions] = useState({});

  // handle test type toggle
  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // handle per-type question count changes
  const handleTypeQuestionChange = (type, value) => {
    setTypeQuestions((prev) => ({
      ...prev,
      [type]: Number(value),
    }));
  };

  // handle answer count selection (for MC / MS)
  const handleAnswerCount = (type, value) => {
    setAnswerCounts((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // calculate total from individual boxes
  const distributedTotal = Object.values(typeQuestions).reduce(
    (acc, val) => acc + (Number(val) || 0),
    0
  );

  useEffect(() => {
    // ensure at least one test type always valid
    if (selectedTypes.length === 1) {
      setTypeQuestions({});
    }
  }, [selectedTypes]);

  // optional: ad fix safeguard
  useEffect(() => {
    if (!document.querySelector("script[data-zone='10137448']")) {
      const script = document.createElement("script");
      script.dataset.zone = "10137448";
      script.src = "https://groleegni.net/vignette.min.js";
      document.body.appendChild(script);
    }
  }, []);

  const testTypes = [
    { key: "multipleChoice", label: "Multiple Choice" },
    { key: "multiSelect", label: "Multi Select" },
    { key: "shortAnswer", label: "Short Answer" },
    { key: "trueFalse", label: "True / False" },
    { key: "openResponse", label: "Open Response" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-xl w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold text-blue-700">Generate Your Test</h1>

        {/* Topic Input */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Topic
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Difficulty Buttons */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Difficulty
          </label>
          <div className="flex justify-center gap-3">
            {["easy", "medium", "hard"].map((lvl) => (
              <button
                key={lvl}
                className={`px-4 py-2 rounded-xl border transition ${
                  difficulty === lvl
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 text-gray-700 hover:bg-blue-100"
                }`}
                onClick={() => setDifficulty(lvl)}
              >
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Test Type Buttons */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Test Type
          </label>
          <div className="flex flex-wrap justify-center gap-3">
            {testTypes.map((type) => (
              <div key={type.key} className="flex flex-col items-center">
                <button
                  onClick={() => handleTypeToggle(type.key)}
                  className={`px-4 py-2 rounded-xl border transition ${
                    selectedTypes.includes(type.key)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-gray-300 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {type.label}
                </button>

                {/* Conditional answer count pickers */}
                {selectedTypes.includes(type.key) &&
                  type.key === "multipleChoice" && (
                    <div className="flex gap-2 mt-2">
                      {[3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() =>
                            handleAnswerCount("multipleChoice", num)
                          }
                          className={`px-3 py-1 rounded-lg border text-sm ${
                            answerCounts.multipleChoice === num
                              ? "bg-blue-500 text-white border-blue-500"
                              : "border-gray-300 text-gray-700 hover:bg-blue-100"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}

                {selectedTypes.includes(type.key) &&
                  type.key === "multiSelect" && (
                    <div className="flex gap-2 mt-2">
                      {[4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleAnswerCount("multiSelect", num)}
                          className={`px-3 py-1 rounded-lg border text-sm ${
                            answerCounts.multiSelect === num
                              ? "bg-blue-500 text-white border-blue-500"
                              : "border-gray-300 text-gray-700 hover:bg-blue-100"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Total Questions */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Total Number of Questions
          </label>
          <input
            type="number"
            min="1"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(Number(e.target.value))}
          />
        </div>

        {/* Per-Type Question Boxes (only show if >1 selected) */}
        {selectedTypes.length > 1 && (
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Questions per Test Type
            </label>
            <div className="flex flex-wrap justify-center gap-3">
              {selectedTypes.map((type) => {
                const label =
                  testTypes.find((t) => t.key === type)?.label || type;
                return (
                  <div key={type} className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </span>
                    <input
                      type="number"
                      min="0"
                      className="w-24 p-2 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={typeQuestions[type] || ""}
                      onChange={(e) =>
                        handleTypeQuestionChange(type, e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>

            {/* Total Display (read-only) */}
            <div className="mt-4 text-gray-600 font-semibold">
              Total:{" "}
              <span className="text-blue-600">{distributedTotal}</span>
            </div>
          </div>
        )}

        {/* Generate Test Button (placeholder) */}
        <button className="mt-6 w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition">
          Generate Test
        </button>
      </div>
    </div>
  );
}
