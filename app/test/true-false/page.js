"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrueFalse({ question, onAnswer }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  if (!question) return null;

  const handleCheck = () => {
    if (selected === null) return;
    onAnswer({ correct: selected === question.correct });
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", fontFamily: "Segoe UI, Roboto, sans-serif", backgroundColor: "#f8fafc", color: "#222" }}>
      {/* Header */}
      <div style={{ width: "100%", maxWidth: "800px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button onClick={() => router.push("/")} style={{ backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "12px", padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}>Leave</button>
        <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{question?.topic || "Unknown Topic"}</div>
        <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "#1976d2" }}>TheTestifyAI</div>
      </div>
      <hr style={{ width: "100%", maxWidth: "800px", marginBottom: "24px", borderColor: "#1976d2" }} />

      {/* Question */}
      <div style={{ border: "3px solid #1976d2", borderRadius: "16px", backgroundColor: "white", width: "100%", maxWidth: "700px", padding: "24px", fontSize: "1.1rem", fontWeight: 500, boxShadow: "0 4px 10px rgba(0,0,0,0.05)", marginBottom: "24px", textAlign: "center" }}>
        {question?.question}
      </div>

      {/* Answers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "400px" }}>
        {["True", "False"].map((ans, i) => (
          <button
            key={i}
            onClick={() => setSelected(ans)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: selected === ans ? "3px solid #1976d2" : "2px solid rgba(0,0,0,0.1)",
              backgroundColor: selected === ans ? "rgba(25,118,210,0.1)" : "white",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {ans}
          </button>
        ))}
      </div>

      {/* Check Button */}
      <div style={{ width: "100%", maxWidth: "700px", display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
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
