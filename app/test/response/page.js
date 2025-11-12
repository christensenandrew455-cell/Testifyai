"use client"; // ← add this

import React, { useState } from "react";

export const dynamic = "force-dynamic";

export default function Response({ question, onAnswer }) {
  const [answer, setAnswer] = useState("");

  if (!question) return null;

  const handleCheck = () => {
    onAnswer({ correct: null });
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

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "120px",
          border: "2px solid rgba(0,0,0,0.1)",
          borderRadius: "12px",
          padding: "10px",
          fontSize: "1rem",
          fontFamily: "inherit",
          marginBottom: "24px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      />

      <button
        onClick={handleCheck} // ← renamed Submit → Check
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
  );
}
