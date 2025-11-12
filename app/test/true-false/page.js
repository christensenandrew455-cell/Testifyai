"use client";
import React from "react";

export default function TrueFalse({
  question,
  onAnswer,
  topic,
  currentIndex,
  totalQuestions,
}) {
  if (!question) return null;

  const handleCheck = (ans) => {
    onAnswer({ correct: ans === question.correct });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        color: "#222",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "1.1rem",
          marginBottom: "16px",
        }}
      >
        {topic}
      </div>

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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {["True", "False"].map((ans) => (
          <button
            key={ans}
            onClick={() => handleCheck(ans)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "2px solid rgba(0,0,0,0.1)",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {ans}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "24px",
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ fontWeight: 600, marginRight: "16px" }}>
          Question {currentIndex + 1} of {totalQuestions}
        </div>
      </div>
    </div>
  );
}
