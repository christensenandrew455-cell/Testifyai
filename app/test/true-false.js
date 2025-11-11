"use client";
import React, { useState } from "react";

export default function TrueFalse({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    const userAnswer = selected === 0 ? "True" : "False";
    const isCorrect = userAnswer === question.correct;
    setCorrect(isCorrect);
    setShowFeedback(true);
    setTimeout(() => onAnswer({ correct: isCorrect, answer: userAnswer }), 2000);
  };

  return (
    <div style={{ textAlign: "center", color: "#fff" }}>
      <div
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "2px solid rgba(255,255,255,0.15)",
          borderRadius: 14,
          padding: 24,
          marginBottom: 20,
        }}
      >
        {question.question}
      </div>

      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        {["True", "False"].map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            disabled={showFeedback}
            style={{
              background: selected === i ? "#0ea5e9" : "rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              fontWeight: 600,
              cursor: showFeedback ? "not-allowed" : "pointer",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selected === null || showFeedback}
        style={{
          marginTop: 20,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: 10,
          fontWeight: 700,
          cursor: selected === null ? "not-allowed" : "pointer",
        }}
      >
        Check Answer
      </button>

      {showFeedback && (
        <div
          style={{
            marginTop: 24,
            background: correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            border: `2px solid ${
              correct ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"
            }`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          {correct ? "✅ Correct!" : "❌ Incorrect."}
          <div style={{ marginTop: 6, opacity: 0.9 }}>
            {question.explanation || "No explanation provided."}
          </div>
        </div>
      )}
    </div>
  );
}
