"use client";

import { useEffect, useState } from "react";

export default function MultipleChoiceTest() {
  const [test, setTest] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (!stored) return;
    setTest(JSON.parse(stored));
  }, []);

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading test...</p>
      </div>
    );
  }

  const question = test.questions[index];

  const handleAnswer = (option) => {
    const correct = option === question.correctAnswer;
    setSelected(option);
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    if (index < test.questions.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      alert("✅ Test complete!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Question {question.questionNumber} of {test.totalQuestions}
        </h2>
        <p className="text-lg mb-6">{question.question}</p>

        <div className="grid gap-3 mb-6">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={showFeedback}
              className={`p-3 rounded-md border text-left transition-all ${
                selected === opt
                  ? isCorrect
                    ? "bg-green-500 border-green-300"
                    : "bg-red-500 border-red-300"
                  : "bg-white/10 border-white/30 hover:bg-white/20"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className="text-center mb-4">
            <p
              className={`font-semibold ${
                isCorrect ? "text-green-300" : "text-red-300"
              }`}
            >
              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </p>
            <p className="mt-2 text-sm text-gray-200">
              {question.explanation}
            </p>
          </div>
        )}

        {showFeedback && (
          <button
            onClick={handleNext}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}

