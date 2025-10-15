"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TestPage() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const questions = [
    {
      question: "What is the capital of France?",
      answers: ["Berlin", "Paris", "Madrid", "Rome"],
      correct: "Paris",
    },
    {
      question: "Which planet is closest to the Sun?",
      answers: ["Venus", "Earth", "Mercury", "Mars"],
      correct: "Mercury",
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      answers: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"],
      correct: "William Shakespeare",
    },
  ];

  const handleNext = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setScore(newScore);
    } else {
      // Navigate to results page
      router.push(`/results?score=${newScore}&total=${questions.length}`);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center text-gray-900 p-6">
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-blue-600 text-lg font-semibold hover:underline">
          ← Back
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-blue-600 mb-4">TestifyAI Quiz</h1>
      <p className="text-gray-700 mb-6">
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <div className="bg-white shadow-md rounded-2xl p-6 w-11/12 sm:w-2/3 lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h2>

        <div className="space-y-3 mb-6">
          {questions[currentQuestion].answers.map((answer, index) => (
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

        <div className="flex justify-end">
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
