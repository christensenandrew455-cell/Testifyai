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

  // Load questions from localStorage when page loads
  useEffect(() => {
    const savedQuestions = localStorage.getItem("testQuestions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      alert("No test found! Returning to home.");
      router.push("/");
    }
  }, [router]);

  // Go to next question or results
  const handleNext = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === questions[currentQuestion].correct;
    if (correct) setScore((prev) => prev + 1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Go to results page
      router.push(`/results?score=${score + (correct ? 1 : 0)}&total=${questions.length}`);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 text-gray-900 p-6">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-blue-600 text-lg font-semibold hover:underline">
          ← Leave Test
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-blue-600 mb-4">TestifyAI</h1>
      <p className="text-gray-700 mb-6">
        Question {currentQuestion + 1} of {questions.length}
      </p>

      {/* Question Box */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">{current.question}</h2>

        <div className="space-y-3 mb-6">
          {current.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(answer)}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selectedAnswer === answer
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-blue-50"
              }`}
            >
              {answer}
            </button>
          ))}
        </div>

        {/* Next / Submit Button */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Score: {score}</p>
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              selectedAnswer
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
