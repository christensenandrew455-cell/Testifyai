"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function MultiSelect({ question, onAnswer }) {
  const router = useRouter();
  const [selected, setSelected] = useState([]);

  if (!question) return null;

  const handleToggle = (i) => {
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  const handleCheck = () => {
    const correctSet = new Set(question.correctIndices);
    const selectedSet = new Set(selected);
    const correct =
      correctSet.size === selectedSet.size && [...correctSet].every((val) => selectedSet.has(val));
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

      {/* Multi-select options */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {question.answers?.map((ans, i) => (
          <button
            key={i}
            onClick={() => handleToggle(i)}
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
            {String.fromCharCode(65 + i)}. {ans}
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
