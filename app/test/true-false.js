"use client";

import { useState } from "react";

export default function TrueFalseTest({ questionData, onSelectionChange }) {
  const [selected, setSelected] = useState(null);

  const answers = ["True", "False"];

  const handleSelect = (index) => {
    setSelected(index);
    if (onSelectionChange) onSelectionChange(index);
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
        }}
      >
        {questionData.question}
      </div>

      {/* True / False options */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "24px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "10px",
              padding: "10px 16px",
              borderRadius: "12px",
              border:
                selected === i
                  ? "3px solid #1976d2"
                  : "2px solid rgba(0,0,0,0.1)",
              backgroundColor:
                selected === i ? "rgba(25,118,210,0.1)" : "white",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 500,
            }}
          >
            {/* Radio circle */}
            <div
              style={{
                height: "16px",
                width: "16px",
                borderRadius: "50%",
                border:
                  selected === i
                    ? "6px solid #1976d2"
                    : "2px solid rgba(0,0,0,0.3)",
                transition: "all 0.2s",
              }}
            ></div>
            <strong>{ans}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
