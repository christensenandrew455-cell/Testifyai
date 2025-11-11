"use client";
import React, { useState, useEffect } from "react";
import MultipleChoice from "../multiple-choice";
import TrueFalse from "../true-false";
import MultiSelect from "../multi-select";
import ShortAnswer from "../short-answer";
import OpenResponse from "../open-response";

export default function TestController() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load generated test (mock fallback if none)
  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      setQuestions(JSON.parse(stored).questions || []);
    } else {
      // fallback sample
      setQuestions([
        {
          type: "multiple-choice",
          question: "What color is the sky?",
          answers: ["Blue", "Green", "Red", "Yellow"],
          correct: "Blue",
          explanation: "The sky appears blue due to Rayleigh scattering.",
        },
      ]);
    }
    setLoading(false);
  }, []);

  const handleAnswer = ({ correct }) => {
    setTimeout(() => {
      if (index + 1 < questions.length) setIndex(index + 1);
      else alert("✅ Test Complete!");
    }, 2000);
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #001f3f, #000)",
          color: "#fff",
        }}
      >
        Loading test...
      </div>
    );

  const question = questions[index];
  if (!question)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #001f3f, #000)",
          color: "#fff",
        }}
      >
        No questions available.
      </div>
    );

  const renderComponent = () => {
    switch (question.type) {
      case "multiple-choice":
        return <MultipleChoice question={question} onAnswer={handleAnswer} />;
      case "true-false":
        return <TrueFalse question={question} onAnswer={handleAnswer} />;
      case "multi-select":
        return <MultiSelect question={question} onAnswer={handleAnswer} />;
      case "short-answer":
        return <ShortAnswer question={question} onAnswer={handleAnswer} />;
      case "open-response":
        return <OpenResponse question={question} onAnswer={handleAnswer} />;
      default:
        return (
          <div style={{ color: "#fff" }}>
            Unsupported question type: {question.type}
          </div>
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #001f3f, #000)",
        padding: "40px 20px",
        color: "#fff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          {questions[index]?.topic || "Test"}
        </h2>
        <div style={{ opacity: 0.8 }}>
          Question {index + 1} of {questions.length}
        </div>
      </div>

      {renderComponent()}
    </div>
  );
}
