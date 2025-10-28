"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function ResultsInner() {
  const searchParams = useSearchParams();

  const score = parseInt(searchParams.get("score") || "0", 10);
  const total = parseInt(searchParams.get("total") || "0", 10);
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const [topic, setTopic] = useState(searchParams.get("topic") || "Unknown Topic");

  // 🧩 Try to recover topic from sessionStorage if not in URL
  useEffect(() => {
    if (!topic || topic === "Unknown Topic") {
      try {
        const stored = sessionStorage.getItem("testData");
        if (stored) {
          const data = JSON.parse(stored);
          if (data.length > 0 && data[0].topic) {
            setTopic(data[0].topic);
          }
        }
      } catch (err) {
        console.error("Error loading topic:", err);
      }
    }
  }, [topic]);

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
