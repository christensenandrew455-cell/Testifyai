"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function TrueFalse({ question, onAnswer, topic, currentIndex, totalQuestions }) {
  const router = useRouter();
  if (!question) return null;

  const handleAnswer = (i) => onAnswer({ correct: i === question.correct });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#f8fafc", padding: "40px 20px", fontFamily: "Segoe UI, Roboto, sans-serif", color: "#222" }}>
      {/* Header */}
      <div style={{ display: "flex", width: "100%", maxWidth: "800px", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", borderBottom: "2px solid #1976d2", paddingBottom: "10px" }}>
        <button onClick={() => router.push("/")} style={{ backgroundColor: "#1976d2", color: "#fff", border: "none", borderRadius: "10px", padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}>Leave</button>
        <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{topic}</div>
        <div style={{ fontWeight: 700, color: "#1976d2" }}>TheTestifyAI</div>
      </div>

      {/* Question Box */}
      <div style={{ border: "3px solid #1976d2", borderRadius: "16px", backgroundColor: "white", width: "100%", maxWidth: "700px", padding: "24px", fontSize: "1.1rem", fontWeight: 500, textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
        {question.question}
      </div>

      {/* Answers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "400px" }}>
        {["True", "False"].map((ans, i) => (
          <button key={i} onClick={() => handleAnswer(i)} style={{ padding: "12px 20px", borderRadius: "12px", border: "2px solid rgba(0,0,0,0.1)", backgroundColor: "white", cursor: "pointer", fontSize: "1rem", fontWeight: 600, transition: "all 0.2s" }}>
            {ans}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ width: "100%", maxWidth: "700px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
        <div style={{ fontWeight: 600 }}>Question {currentIndex + 1} of {totalQuestions}</div>
        <div /> {/* placeholder for spacing; no check needed since answers act immediately */}
      </div>
    </div>
  );
}
