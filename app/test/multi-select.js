"use client";

import { useState, useEffect } from "react";

export default function MultiSelectTest({ questionData, onSelectionChange }) {
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState([]);

  // Shuffle answers but keep letters A–F fixed order
  useEffect(() => {
    if (questionData?.answers?.length) {
      const shuffled = [...questionData.answers];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setAnswers(shuffled);
    }
  }, [questionData]);

  const toggleSelect = (index) => {
    setSelected((prev) => {
      const exists = prev.includes(index);
      const updated = exists
        ? prev.filter((i) => i !== index)
        : [...prev, index];
      if (onSelectionChange) onSelectionChange(updated);
      return updated;
    });
  };

  if (!questionData) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#555" }}>
        Loading question...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        {questionData.question}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "24px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {answers.map((ans, i) => {
          const letter = String.fromCharCode(65 + i); // A–F
          const isChecked = selected.includes(i);

          return (
            <button
              key={i}
              onClick={() => toggleSelect(i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "12px",
                padding: "10px 16px",
                borderRadius: "12px",
                border: isChecked
                  ? "3px solid #1976d2"
                  : "2px solid rgba(0,0,0,0.1)",
                backgroundColor: isChecked ? "rgba(25,118,210,0.1)" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 500,
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  height: "18px",
                  width: "18px",
                  borderRadius: "4px",
                  border: isChecked
                    ? "5px solid #1976d2"
                    : "2px solid rgba(0,0,0,0.3)",
                  backgroundColor: isChecked ? "#1976d2" : "white",
                  transition: "all 0.2s",
                }}
              ></div>
              <strong>{letter}.</strong> {ans}
            </button>
          );
        })}
      </div>
    </div>
  );
}
