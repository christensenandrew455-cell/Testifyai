"use client";

import { useState, useEffect } from "react";

// Helper Components
const ChoiceButtons = ({ options, selected, onSelect }) => (
  <div className="grid grid-cols-1 gap-3 mt-4">
    {options.map((opt, idx) => (
      <button
        key={idx}
        onClick={() => onSelect(opt)}
        className={`p-3 rounded-xl text-left border transition-all ${
          selected === opt
            ? "bg-blue-600 text-white border-blue-700"
            : "bg-white text-black border-gray-300 hover:bg-blue-100"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const MultiSelectChoices = ({ options, selected, onSelect }) => (
  <div className="grid grid-cols-1 gap-3 mt-4">
    {options.map((opt, idx) => (
      <button
        key={idx}
        onClick={() => onSelect(opt)}
        className={`p-3 rounded-xl text-left border transition-all ${
          selected.includes(opt)
            ? "bg-blue-600 text-white border-blue-700"
            : "bg-white text-black border-gray-300 hover:bg-blue-100"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default function TestController() {
  const [testData, setTestData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (!stored) {
      setTestData(null);
      setLoading(false);
      return;
    }
    setTestData(JSON.parse(stored));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-700 to-black text-white">
        <h2 className="text-xl font-semibold">Loading your test...</h2>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-700 to-black text-white text-center">
        <h2 className="text-2xl font-semibold mb-4">No test data found</h2>
        <a
          href="/"
          className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition"
        >
          Go Home
        </a>
      </div>
    );
  }

  const { topic, questions } = testData;
  const question = questions[currentIndex];

  const handleSelect = (opt) => {
    if (question.type === "multi-select") {
      setSelectedAnswers((prev) =>
        prev.includes(opt)
          ? prev.filter((a) => a !== opt)
          : [...prev, opt]
      );
    } else {
      setSelectedAnswer(opt);
    }
  };

  const handleCheck = () => {
    if (
      (question.type === "multi-select" && selectedAnswers.length === 0) ||
      (question.type !== "multi-select" && !selectedAnswer)
    ) {
      setFeedback("Please select an answer before checking!");
      return;
    }

    const correct =
      question.type === "multi-select"
        ? JSON.stringify(selectedAnswers.sort()) ===
          JSON.stringify([question.answer].flat().sort())
        : selectedAnswer === question.answer;

    setFeedback(correct ? "✅ Correct!" : "❌ Incorrect.");
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setFeedback(null);
    setCurrentIndex((i) => i + 1);
  };

  if (currentIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-700 to-black text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Test Complete!</h1>
        <a
          href="/"
          className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition"
        >
          Generate Another Test
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-black flex flex-col items-center justify-center text-white px-6">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {topic.toUpperCase()}
        </h2>
        <p className="text-lg mb-6 text-center">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <div className="text-xl font-semibold text-center mb-6">
          {question.question}
        </div>

        {question.type === "multiple-choice" && (
          <ChoiceButtons
            options={question.options}
            selected={selectedAnswer}
            onSelect={handleSelect}
          />
        )}

        {question.type === "multi-select" && (
          <MultiSelectChoices
            options={question.options}
            selected={selectedAnswers}
            onSelect={handleSelect}
          />
        )}

        {(question.type === "true-false" ||
          question.type === "short-answer" ||
          question.type === "open-response") && (
          <ChoiceButtons
            options={question.options || ["True", "False"]}
            selected={selectedAnswer}
            onSelect={handleSelect}
          />
        )}

        {feedback && (
          <div className="mt-6 text-center text-lg font-bold">
            {feedback}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-8">
          {!feedback ? (
            <button
              onClick={handleCheck}
              className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
