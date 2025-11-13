"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function MultipleChoice({
  question,
  onAnswer,
  topic,
  currentIndex,
  totalQuestions,
}) {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  if (!question) return null;

  const handleCheck = () => {
    if (selected === null) return;

    // Compare text, not index
    const userAnswer = question.answers[selected];
    const correctAnswer = question.correct;

    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    // Build query params
    const params = new URLSearchParams({
      question: question.question,
      userAnswer: JSON.stringify(userAnswer),
      correctAnswer: JSON.stringify(correctAnswer),
      explanation: question.explanation || "",
      index: currentIndex.toString(),
      topic,
    });

    router.push(`${isCorrect ? "/correct" : "/incorrect"}?${params.toString()}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        color: "#222",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "800px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          borderBottom: "2px solid #1976d2",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "6px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Leave
        </button>
        <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{topic}</div>
        <div style={{ fontWeight: 700, color: "#1976d2" }}>TheTestifyAI</div>
      </div>

      {/* Question Box */}
      <div
        style={{
          border: "3px solid #1976d2",
          borderRadius: "16px",
          backgroundColor: "white",
          width: "100%",
          maxWidth: "700px",
          padding: "24px",
          fontSize: "1.1rem",
          fontWeight: 500,
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
      >
        {question.question}
      </div>

      {/* Answers */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {question.answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "10px",
              padding: "12px 20px",
              borderRadius: "12px",
              border:
                selected === i ? "3px solid #1976d2" : "2px solid rgba(0,0,0,0.1)",
              backgroundColor: selected === i ? "rgba(25,118,210,0.1)" : "white",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            <strong>{String.fromCharCode(65 + i)}.</strong> {ans}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
        }}
      >
        <div style={{ fontWeight: 600 }}>
          Question {currentIndex + 1} of {totalQuestions}
        </div>
        <button
          onClick={handleCheck}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Check
        </button>
      </div>
    </div>
  );
}
