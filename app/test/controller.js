"use client";

import { useState, useEffect } from "react";
import MultipleChoiceTest from "./multiple-choice";
import MultiSelectTest from "./multi-select";
import TrueFalseTest from "./true-false";
import ShortAnswerTest from "./short-answer";
import OpenResponseTest from "./open-response";

export default function TestController() {
  const [testData, setTestData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Load test data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) setTestData(JSON.parse(stored));
  }, []);

  if (!testData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
        <p>Loading your test...</p>
      </div>
    );
  }

  const questions = testData.questions || [];
  const question = questions[currentIndex];

  const handleAnswer = (isAnswerCorrect) => {
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      alert("✅ Test complete!");
    }
  };

  const renderQuestion = () => {
    if (!question) return <p>No question data found.</p>;

    const type = question.testType || testData.testType;

    switch (type) {
      case "multiple-choice":
        return (
          <MultipleChoiceTest
            questionData={question}
            onCheckAnswer={handleAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            onNext={handleNext}
          />
        );
      case "multi-select":
        return (
          <MultiSelectTest
            questionData={question}
            onCheckAnswer={handleAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            onNext={handleNext}
          />
        );
      case "true-false":
        return (
          <TrueFalseTest
            questionData={question}
            onCheckAnswer={handleAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            onNext={handleNext}
          />
        );
      case "short-answer":
        return (
          <ShortAnswerTest
            questionData={question}
            onNext={handleNext}
          />
        );
      case "open-response":
        return (
          <OpenResponseTest
            questionData={question}
            onNext={handleNext}
          />
        );
      default:
        return <p>Unknown test type: {type}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">{testData.topic}</h1>
      {renderQuestion()}
    </div>
  );
}
