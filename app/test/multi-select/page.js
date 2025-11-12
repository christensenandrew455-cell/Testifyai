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
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>{question.question}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "600px" }}>
        {question.answers.map((letter, idx) => (
          <label
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#fff",
              cursor: "pointer",
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
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Check
      </button>
    </div>
  );
}
