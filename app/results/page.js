"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function ResultsInner() {
  const searchParams = useSearchParams();

  const scoreParam = searchParams.get("score");
  const totalParam = searchParams.get("total");
  const topicParam = searchParams.get("topic");

  const [score, setScore] = useState(parseInt(scoreParam || "0", 10));
  const [total, setTotal] = useState(parseInt(totalParam || "0", 10));
  const [topic, setTopic] = useState(topicParam || "Unknown Topic");

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  // 🧩 If data is missing, recover from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.length > 0) {
          if (!topicParam) setTopic(data[0].topic || "Unknown Topic");
          if (!totalParam) setTotal(data.length);
          if (!scoreParam) setScore(data.filter((q) => q.isCorrect).length);
        }
      }
    } catch (err) {
      console.error("Error loading stored data:", err);
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
            fontSize: "1.6rem",
            fontWeight: "800",
            color: "#1976d2",
            marginBottom: "10px",
          }}
        >
          {topic}
        </h1>

        <p style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>
          {score} out of {total}
        </p>

        <p
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#1976d2",
            marginBottom: "20px",
          }}
        >
          {percent}%
        </p>

        <p style={{ fontSize: "1.1rem", marginBottom: "30px", color: "#555" }}>
          {getMessage()}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Link href="/test">
            <button
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 20px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Try Again
            </button>
          </Link>

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
