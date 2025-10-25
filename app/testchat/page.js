"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TestChat() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedQuestions = localStorage.getItem("testQuestions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      alert("No test found! Returning to home.");
      router.push("/");
    }
  }, [router]);

  // 🧠 New: Get explanation from AI endpoint
  const fetchAIExplanation = async (question, correctAnswer) => {
    try {
      setLoading(true);
      const res = await fetch("/api/explain-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, correctAnswer }),
      });
      const data = await res.json();
      setLoading(false);
      return data.explanation || "Explanation not available.";
    } catch (err) {
      console.error("Error getting explanation:", err);
      setLoading(false);
      return "Explanation not available.";
    }
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;

    const currentQ = questions[currentQuestion];
    const correct = selectedAnswer === currentQ.correct;

    setFeedbackType(correct ? "correct" : "wrong");
    setShowFeedback(true);
    setShowNext(false);

    if (correct) setScore((prev) => prev + 1);

    // 🔍 Ask AI for a fact/explanation
    const explanationText = await fetchAIExplanation(currentQ.question, currentQ.correct);
    setExplanation(explanationText);

    if (correct) {
      setShowNext(true);
    } else {
      setTimeout(() => {
        setShowNext(true);
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setShowNext(false);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      router.push(`/ad?score=${score}&total=${questions.length}`);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 text-gray-700">
        <p>Loading questions...</p>
      </div>
    );
  }

  const current = questions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 text-gray-900 p-6 relative">
      {/* Leave Test */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-blue-600 text-lg font-semibold hover:underline">
          ← Leave Test
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-blue-600 mb-4">TheTestifyAI</h1>
      <p className="text-gray-700 mb-6">
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <div className="bg-white shadow-md rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2">
        <h2 className="text-xl font-semibold mb-6">{current.question}</h2>

        <div className="space-y-3 mb-6">
          {(current.answers || current.options || []).map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              className={`w-full text-left p-3 rounded-xl border-2 font-medium transition-colors duration-200 ${
                selectedAnswer === answer
                  ? "bg-blue-700 border-blue-700 text-white"
                  : "bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {answer}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-600">Score: {score}</p>
          <button
            onClick={handleNext}
            disabled={!selectedAnswer || loading}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              selectedAnswer && !loading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {loading ? "Loading..." : currentQuestion === questions.length - 1 ? "Submit" : "Check Answer"}
          </button>
        </div>
      </div>

      {/* ✅ Feedback Overlay */}
      {showFeedback && (
        <div
          className={`fixed inset-0 flex flex-col items-center justify-center text-white text-center z-50 transition-all duration-500 ${
            feedbackType === "correct" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <h2 className="text-6xl font-bold mb-4">
            {feedbackType === "correct" ? "✅ Correct!" : "❌ Incorrect"}
          </h2>
          <p className="text-xl mb-6 px-8 max-w-xl">{explanation}</p>

          {showNext && (
            <button
              onClick={handleNextQuestion}
              className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Next Question →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
