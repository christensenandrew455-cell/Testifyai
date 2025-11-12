"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TrueFalse({ question, onAnswer }) {
  const router = useRouter();
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const data = JSON.parse(stored);
      setTopic(data.topic || "");
    }
  }, []);

  const handleAnswer = (answer) => {
    onAnswer({ correct: answer === question.correct });
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
          gap: "12px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {["True", "False"].map((ans) => (
          <button
            key={ans}
            onClick={() => handleAnswer(ans)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "2px solid rgba(0,0,0,0.1)",
              backgroundColor: "white",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(25,118,210,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
          >
            {ans}
          </button>
        ))}
      </div>
    </div>
  );
}
