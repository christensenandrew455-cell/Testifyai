"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function normalizeAnswerText(s = "") {
  return String(s).trim().toLowerCase();
}

function resolveCorrectTextTF(question, correct) {
  if (typeof correct === "number") {
    return String(question.answers?.[correct] ?? correct);
  }
  if (typeof correct === "string" && /^[A-B]$/i.test(correct.trim())) {
    const idx = correct.trim().toUpperCase().charCodeAt(0) - 65;
    return String(question.answers?.[idx] ?? correct);
  }
  return String(correct);
}

export default function TrueFalse({
  question,
  onAnswer,
  topic,
  currentIndex,
  totalQuestions,
}) {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  if (!question) return null;

  const handleCheck = () => {
    if (selected === null) return;

    const userText = String(question.answers?.[selected] ?? "");
    const correctText = resolveCorrectTextTF(question, question.correct);

    const isCorrect =
      normalizeAnswerText(userText) === normalizeAnswerText(correctText);

    const params = new URLSearchParams({
      question: question.question || "",
      userAnswer: JSON.stringify([userText]),
      correctAnswer: JSON.stringify([correctText]),
      explanation: question.explanation || "",
      index: String(currentIndex ?? 0),
      topic: topic || "",
    });

    router.push(
      `${isCorrect ? "/correct" : "/incorrect"}?${params.toString()}`
    );

    try {
      onAnswer?.({ correct: isCorrect, userAnswer: [userText] });
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
          marginBottom: "10px",
        }}
      >
        {question.question}
      </div>

      {/* ✔ Correct test-style instruction */}
      <div
        style={{
          marginBottom: "20px",
          fontSize: "1rem",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Select whether the statement above is True or False:
      </div>

      {/* Answer buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {question.answers?.map((ans, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border:
                selected === i
                  ? "3px solid #1976d2"
                  : "2px solid rgba(0,0,0,0.1)",
              backgroundColor:
                selected === i ? "rgba(25,118,210,0.1)" : "white",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {ans}
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
