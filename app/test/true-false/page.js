"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrueFalse({ question, onAnswer }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  if (!question) return null;

  const handleCheck = () => {
    const correct = selected === question.correctIndex;
    onAnswer({ correct });
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
        <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{question.topic}</div>
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

      {/* True/False Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {["True", "False"].map((ans, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: selected === i ? "3px solid #1976d2" : "2px solid rgba(0,0,0,0.1)",
              backgroundColor: selected === i ? "rgba(25,118,210,0.1)" : "white",
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
