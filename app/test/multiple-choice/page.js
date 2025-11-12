"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MultipleChoice({ question, onAnswer }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const data = JSON.parse(stored);
      setTopic(data.topic || "");
    }
  }, []);

  const handleCheck = () => {
    if (selected === null) return;
    const isCorrect = question.answers[selected] === question.correct;
    onAnswer?.({ correct: isCorrect });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "40px 20px",
        backgroundColor: "#f8fafc",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        color: "#222",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Leave
        </button>
        <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{topic}</div>
        <div style={{ fontWeight: 700, color: "#1976d2" }}>TheTestifyAI</div>
      </div>

      <hr style={{ width: "100%", maxWidth: "800px", marginBottom: "24px" }} />

      {/* Question */}
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
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {question.question}
      </div>

      {/* Answers */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {question.answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              borderRadius: "12px",
              border: selected === i ? "3px solid #1976d2" : "2px solid rgba(0,0,0,0.1)",
              backgroundColor: selected === i ? "rgba(25,118,210,0.1)" : "white",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s",
              justifyContent: "flex-start",
            }}
          >
            <strong>{String.fromCharCode(65 + i)}.</strong> {ans}
          </button>
        ))}
      </div>

      {/* Check button */}
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          gap: "10px",
        }}
      >
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
