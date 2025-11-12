"use client"; // ← add this

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
        {["True", "False"].map((answer) => (
          <button
            key={answer}
            onClick={() => handleAnswer(answer)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "2px solid rgba(0,0,0,0.1)",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "1rem",
              fontWeight: 600,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(25,118,210,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}
