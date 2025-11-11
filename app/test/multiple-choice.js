"use client";
import React, { useState } from "react";

export default function MultipleChoice({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSelect = (choice) => {
    if (showFeedback) return;
    setSelected(choice);

    const isCorrect =
      choice === question.correct ||
      choice.toLowerCase() === question.correct?.toLowerCase();

    setCorrect(isCorrect);
    setShowFeedback(true);

    setTimeout(() => onAnswer({ correct: isCorrect, answer: choice }), 2000);
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

      <div style={{ display: "grid", gap: 12, maxWidth: 600, margin: "0 auto" }}>
        {question.answers.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            style={{
              background:
                showFeedback && opt === question.correct
                  ? "rgba(16,185,129,0.25)"
                  : selected === opt
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.1)",
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
