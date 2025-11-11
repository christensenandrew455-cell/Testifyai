"use client";
import React, { useState } from "react";

export default function MultiSelect({ question, onAnswer }) {
  const [selected, setSelected] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  const toggleSelect = (opt) => {
    if (showFeedback) return;
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = () => {
    // Normalize correct answers into a Set
    const correctSet = new Set(
      question.correct.map((c) =>
        /^[A-D]$/.test(c) ? question.answers[c.charCodeAt(0) - 65] : c
      )
    );

    const selectedSet = new Set(selected);
    const isCorrect =
      correctSet.size === selectedSet.size &&
      [...correctSet].every((v) => selectedSet.has(v));

    setCorrect(isCorrect);
    setShowFeedback(true);

    setTimeout(() => onAnswer({ correct: isCorrect, answer: selected }), 2000);
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
            onClick={() => toggleSelect(opt)}
            style={{
              background: selected.includes(opt)
                ? "rgba(59,130,246,0.3)"
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

      <button
        onClick={handleSubmit}
        disabled={selected.length === 0 || showFeedback}
        style={{
          marginTop: 20,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: 10,
          fontWeight: 700,
          cursor: selected.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        Check Answer
      </button>

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
