"use client";
import React, { useState } from "react";

export const dynamic = "force-dynamic";

export default function Response({ question, onAnswer }) {
  const [answer, setAnswer] = useState("");

  if (!question) return null;

  const handleSubmit = () => {
    // No auto-grading for open response
    onAnswer({ correct: null });
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

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "120px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
}
