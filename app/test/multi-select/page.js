"use client";
import React from "react";

export const dynamic = "force-dynamic";

export default function MultiSelect({ question, onAnswer }) {
  const [selected, setSelected] = React.useState([]);

  if (!question) return null;

  const handleToggle = (letter) => {
    setSelected((prev) =>
      prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter]
    );
  };

  const handleCheck = () => {
    const correctSet = new Set(question.correct);
    const selectedSet = new Set(selected);
    const correct =
      correctSet.size === selectedSet.size &&
      [...correctSet].every((val) => selectedSet.has(val));
    onAnswer({ correct });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        color: "#222",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
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
              backgroundColor: selected.includes(letter)
                ? "rgba(25,118,210,0.1)"
                : "white",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(letter)}
              onChange={() => handleToggle(letter)}
              style={{ marginRight: "10px" }}
            />
            {letter}
          </label>
        ))}
      </div>

      <button
        onClick={handleCheck}
        style={{
          marginTop: "24px",
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
  );
}
