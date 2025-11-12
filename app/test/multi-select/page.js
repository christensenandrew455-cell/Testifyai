"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MultiSelect({ question, onAnswer }) {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const data = JSON.parse(stored);
      setTopic(data.topic || "");
    }
  }, []);

  const toggle = (letter) => {
    setSelected((prev) => (prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter]));
  };

  const handleCheck = () => {
    const correctSet = new Set(question.correct);
    const selectedSet = new Set(selected);
    const isCorrect =
      correctSet.size === selectedSet.size && [...correctSet].every((val) => selectedSet.has(val));
    onAnswer({ correct: isCorrect });
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
          gap: "10px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {question.answers.map((letter, idx) => (
          <label
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              border: "2px solid rgba(0,0,0,0.1)",
              borderRadius: "12px",
              padding: "10px 14px",
              backgroundColor: selected.includes(letter) ? "rgba(25,118,210,0.1)" : "white",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <input type="checkbox" checked={selected.includes(letter)} onChange={() => toggle(letter)} style={{ marginRight: "10px" }} />
            {letter}
          </label>
        ))}
      </div>

      {/* Check button */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
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
