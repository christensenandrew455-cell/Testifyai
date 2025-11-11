"use client";
import React, { useState } from "react";

export default function ShortAnswer({ question, onAnswer }) {
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSubmit = () => {
    const isCorrect =
      answer.trim().toLowerCase() === question.correct?.toLowerCase();
    setCorrect(isCorrect);
    setShowFeedback(true);
    setTimeout(() => onAnswer({ correct: isCorrect, answer }), 2000);
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

      <input
        type="text"
        placeholder="Type your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={showFeedback}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "none",
          width: "60%",
          background: "rgba(255,255,255,0.1)",
          color: "#fff",
          outline: "none",
          textAlign: "center",
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={!answer || showFeedback}
        style={{
          marginLeft: 10,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: 10,
          fontWeight: 700,
          cursor: !answer ? "not-allowed" : "pointer",
        }}
      >
        Submit
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
