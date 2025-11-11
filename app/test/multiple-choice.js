"use client";

import { useState } from "react";

export default function MultipleChoiceTest({ questionData, onNext }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleCheck = () => {
    if (checked || selected === null) return;
    setChecked(true);
    if (selected === questionData.answer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Incorrect. ${questionData.explanation}`);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #1e3a8a, #93c5fd)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          color: "black",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          maxWidth: "600px",
          width: "100%",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "600" }}>{questionData.question}</h2>
        <div style={{ marginTop: "16px" }}>
          {questionData.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(opt)}
              disabled={checked}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "8px",
                border:
                  selected === opt ? "2px solid #1e3a8a" : "1px solid #ccc",
                background:
                  selected === opt
                    ? "#dbeafe"
                    : checked && questionData.answer === opt
                    ? "#dcfce7"
                    : "white",
                cursor: checked ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {!checked ? (
          <button
            onClick={handleCheck}
            style={{
              marginTop: "16px",
              background: "#1e3a8a",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              border: "none",
            }}
          >
            Check Answer
          </button>
        ) : (
          <>
            <p style={{ marginTop: "12px" }}>{feedback}</p>
            <button
              onClick={onNext}
              style={{
                marginTop: "16px",
                background: "#2563eb",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Next Question
            </button>
          </>
        )}
      </div>
    </div>
  );
}
