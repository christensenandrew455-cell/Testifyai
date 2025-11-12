"use client";
import React, { useState } from "react";

export default function OpenResponse({ question, onAnswer }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onAnswer({ correct: true, answer: text }), 2000);
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

      <textarea
        placeholder="Write your response..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={submitted}
        style={{
          width: "80%",
          height: 120,
          padding: 12,
          borderRadius: 10,
          background: "rgba(255,255,255,0.1)",
          color: "#fff",
          border: "none",
          resize: "none",
          outline: "none",
        }}
      />

      <div>
        <button
          onClick={handleSubmit}
          disabled={!text || submitted}
          style={{
            marginTop: 16,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: !text ? "not-allowed" : "pointer",
          }}
        >
          Submit
        </button>
      </div>

      {submitted && (
        <div
          style={{
            marginTop: 24,
            background: "rgba(16,185,129,0.15)",
            border: "2px solid rgba(16,185,129,0.6)",
            borderRadius: 10,
            padding: 16,
          }}
        >
          ✅ Response submitted!
          <div style={{ marginTop: 6, opacity: 0.9 }}>
            {question.explanation ||
              "Your answer will be reviewed manually or scored later."}
          </div>
        </div>
      )}
    </div>
  );
}
