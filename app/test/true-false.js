"use client";
import React, { useState } from "react";

export default function TrueFalse({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSelect = (value) => {
    if (showFeedback) return;
    setSelected(value);
    const isCorrect =
      value.toString().toLowerCase() === question.correct?.toString().toLowerCase();
    setCorrect(isCorrect);
    setShowFeedback(true);
    setTimeout(() => onAnswer({ correct: isCorrect, answer: value }), 2000);
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

      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {["True", "False"].map((val) => (
          <button
            key={val}
            onClick={() => handleSelect(val)}
            style={{
              background:
                showFeedback && val === question.correct
                  ? "rgba(16,185,129,0.25)"
                  : selected === val
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              fontWeight: 600,
              cursor: showFeedback ? "not-allowed" : "pointer",
            }}
          >
            {val}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div
          style={{
            marginTop: 24,
            background: correct
              ? "rgba(16,185,129,0.15)"
              : "rgba(239,68,68,0.15)",
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
