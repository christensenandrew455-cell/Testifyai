"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function OpenResponse({ question, onAnswer }) {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    onAnswer({ answer: text });
    const query = new URLSearchParams({
      question: question.question,
      userAnswer: text,
      correctAnswer: question.correct || "",
      explanation: question.explanation || "",
    }).toString();
    router.push(`/incorrect?${query}`);
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
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your response..."
        style={{
          width: "100%",
          maxWidth: 700,
          padding: 12,
          borderRadius: 10,
          background: "rgba(255,255,255,0.1)",
          border: "none",
          color: "#fff",
          fontSize: 16,
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        style={{
          marginTop: 20,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: 10,
          fontWeight: 700,
          cursor: !text.trim() ? "not-allowed" : "pointer",
        }}
      >
        Submit Answer
      </button>
    </div>
  );
}
