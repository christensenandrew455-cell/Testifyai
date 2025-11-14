"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function ResultsInner() {
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [topic, setTopic] = useState("Unknown Topic");
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        const totalQuestions = data.questions?.length || 0;
        const correctCount = data.questions?.filter((q: any) => q.isCorrect)?.length || 0;
        const testTopic = data.questions?.[0]?.topic || "Unknown Topic";

        setScore(correctCount);
        setTotal(totalQuestions);
        setTopic(testTopic);
        setPercent(totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0);
      }
    } catch (err) {
      console.error("Error reading testData:", err);
    }
  }, []);

  const getMessage = () => {
    if (percent >= 90) return "🔥 Master Level! Excellent job!";
    if (percent >= 70) return "💪 Great work! You’re learning fast.";
    if (percent >= 50) return "🧠 Not bad — keep studying!";
    return "📘 Keep going — you’ll improve!";
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
          borderRadius: "24px",
          backgroundColor: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          padding: "40px",
          textAlign: "center",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "#1976d2",
            marginBottom: "25px",
          }}
        >
          Your Results
        </h1>

        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "700",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          {topic}
        </h2>

        <p
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "#333",
            marginBottom: "5px",
          }}
        >
          {score} / {total}
        </p>

        <p
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#555",
            marginBottom: "20px",
          }}
        >
          {percent}%
        </p>

        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "30px",
            color: "#555",
          }}
        >
          {getMessage()}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Link href="/">
            <button
              style={{
                backgroundColor: "#e0e0e0",
                color: "#333",
                border: "none",
                borderRadius: "12px",
                padding: "10px 20px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Home
            </button>
          </Link>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          fontWeight: "700",
          color: "#1976d2",
          fontSize: "1.1rem",
        }}
      >
        TheTestifyAI
      </div>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsInner />
    </Suspense>
  );
}
