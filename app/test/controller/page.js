"use client";
import React, { useState, useEffect } from "react";
import MultipleChoice from "../multiple-choice/page";
import TrueFalse from "../true-false/page";
import MultiSelect from "../multi-select/page";
import ShortAnswer from "../short-answer/page";
import OpenResponse from "../open-response/page";

export default function TestController() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load generated test (from sessionStorage)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        console.log("✅ Loaded test data:", data);
        setQuestions(data.questions || []);
      } else {
        console.warn("⚠️ No test data found in sessionStorage, using fallback.");
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
    } catch (err) {
      console.error("❌ Failed to load test data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswer = ({ correct }) => {
    console.log("Answer result:", correct);
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

  // Normalize fields
  const normalizedQuestion = {
    ...question,
    answers: question.answers || question.options || ["A", "B", "C", "D"],
    correct: question.correct || question.answer || "A",
    question: question.question || "No question text",
  };

  // Inline render switcher
  const renderComponent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <MultipleChoice
            question={normalizedQuestion}
            onAnswer={handleAnswer}
          />
        );
      case "true-false":
        return (
          <TrueFalse question={normalizedQuestion} onAnswer={handleAnswer} />
        );
      case "multi-select":
        return (
          <MultiSelect question={normalizedQuestion} onAnswer={handleAnswer} />
        );
      case "response":
        return (
          <OpenResponse question={normalizedQuestion} onAnswer={handleAnswer} />
        );
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
