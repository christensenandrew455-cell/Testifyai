"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ResultsInner() {
  const searchParams = useSearchParams();

  const score = parseInt(searchParams.get("score") || "0", 10);
  const total = parseInt(searchParams.get("total") || "0", 10);
  const topic = searchParams.get("topic") || "Unknown Topic";
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

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
        {/* Title at the top */}
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

        {/* Topic above score */}
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

        {/* Score */}
        <p
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "#333", // ✅ makes the score visible again
            marginBottom: "5px",
          }}
        >
          {score} / {total}
        </p>

        {/* Percent below score */}
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

        {/* Message */}
        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "30px",
            color: "#555",
          }}
        >
          {getMessage()}
        </p>

        {/* Buttons */}
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
