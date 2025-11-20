"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Response({
  question,
  onAnswer,
  topic,
  currentIndex,
  totalQuestions,
  difficulty,
}) {
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  if (!question || !question.question) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "Segoe UI, Roboto, sans-serif",
        }}
      >
        <h2>⚠️ No question data found</h2>
        <p>Please return to the main page and start a new test.</p>
        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: "20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  // ✅ Go to grading page (loading spinner) and pass data in URL
  const handleCheck = () => {
    const data = {
      question: question.question,
      answer,
      topic,
      difficulty,
    };

    router.push(`/test/grading?data=${encodeURIComponent(JSON.stringify(data))}`);
  };

  // Placeholder text depending on question type
  const getPlaceholder = () => {
    if (question.type === "open-response") {
      return "Type your answer and reasoning in the box provided below...";
    }
    // Default to short-answer style
    return "Type your answer in the box provided below...";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        color: "#222",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "800px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          borderBottom: "2px solid #1976d2",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "6px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Leave
        </button>
        <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{topic}</div>
        <div style={{ fontWeight: 700, color: "#1976d2" }}>TheTestifyAI</div>
      </div>

      {/* Question Box */}
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

      {/* Answer Box */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={getPlaceholder()}
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

      {/* Footer */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 600 }}>
          Question {currentIndex + 1} of {totalQuestions}
        </div>
        <button
          onClick={handleCheck}
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
    </div>
  );
}
