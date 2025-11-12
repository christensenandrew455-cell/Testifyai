"use client";
import React from "react";

export const dynamic = "force-dynamic";

export default function TrueFalse({ question, onAnswer }) {
  if (!question) return null;

  const handleAnswer = (answer) => {
    onAnswer({ correct: answer === question.correct });
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>{question.question}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "400px" }}>
        {["True", "False"].map((answer) => (
          <button
            key={answer}
            onClick={() => handleAnswer(answer)}
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}
