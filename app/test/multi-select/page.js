"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function normalizeAnswerText(s = "") {
  return String(s)
    .replace(/^[A-Z]\s*[\.\)]\s*/i, "")
    .trim()
    .toLowerCase();
}

function resolveCorrectArray(question, correct) {
  // Returns array of answer texts
  if (Array.isArray(correct)) {
    return correct.map((c) => {
      if (typeof c === "number") return question.answers?.[c] ?? String(c);
      if (typeof c === "string" && /^[A-Z]$/i.test(c.trim())) {
        const idx = c.trim().toUpperCase().charCodeAt(0) - 65;
        return question.answers?.[idx] ?? c;
      }
      const found = (question.answers || []).find(
        (a) => normalizeAnswerText(a) === normalizeAnswerText(c)
      );
      return found ?? String(c);
    });
  }
  // fallback: if single string/number
  return [resolveCorrectArray(question, correct)[0]];
}

export default function MultiSelect({
  question,
  onAnswer,
  topic,
  currentIndex,
  totalQuestions,
}) {
  const [selected, setSelected] = useState([]);
  const router = useRouter();

  if (!question) return null;

  const toggle = (i) =>
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const handleCheck = () => {
    // user-selected texts
    const userTexts = (selected || []).map((i) => String(question.answers?.[i] ?? ""));

    // resolve correct answers text array
    const correctArray =
      Array.isArray(question.correct) ? resolveCorrectArray(question, question.correct) : resolveCorrectArray(question, question.correct);

    // normalize and compare as sets
    const norm = (arr) => arr.map((a) => normalizeAnswerText(a)).sort();
    const a = norm(userTexts);
    const b = norm(correctArray);

    const isCorrect = a.length === b.length && a.every((v, idx) => v === b[idx]);

    const params = new URLSearchParams({
      question: question.question || "",
      userAnswer: JSON.stringify(userTexts),
      correctAnswer: JSON.stringify(correctArray),
      explanation: question.explanation || "",
      index: String(currentIndex ?? 0),
      topic: topic || "",
    });

    router.push(`${isCorrect ? "/correct" : "/incorrect"}?${params.toString()}`);

    try {
      onAnswer?.({ correct: isCorrect });
    } catch (e) {}
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

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "600px" }}>
        {question.answers?.map((ans, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              borderRadius: "12px",
              border: selected.includes(i) ? "3px solid #1976d2" : "2px solid rgba(0,0,0,0.1)",
              backgroundColor: selected.includes(i) ? "rgba(25,118,210,0.1)" : "white",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <strong>{String.fromCharCode(65 + i)}.</strong>&nbsp; {ans}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
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
