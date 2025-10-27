'use client';

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResultsContent() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const percent = total > 0 ? ((score / total) * 100).toFixed(0) : 0;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Your Results</h1>
        <p style={styles.score}>
          You got {score} out of {total}
        </p>
        <p style={styles.percent}>{percent}%</p>
        <p style={styles.message}>
          {percent >= 90
            ? "🔥 Excellent job!"
            : percent >= 70
            ? "💪 Great work!"
            : percent >= 50
            ? "🧠 Keep practicing!"
            : "📘 Keep going — you’ll improve!"}
        </p>

        <div style={styles.buttons}>
          <Link href="/test" style={styles.tryAgain}>
            Try Again
          </Link>
          <Link href="/" style={styles.home}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#f8f8f8",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2rem",
    color: "#1565c0",
    marginBottom: "20px",
  },
  score: {
    fontSize: "1.4rem",
    color: "#333",
  },
  percent: {
    fontSize: "2rem",
    color: "#1976d2",
    fontWeight: "bold",
    margin: "10px 0",
  },
  message: {
    margin: "10px 0 30px",
    fontSize: "1.1rem",
    color: "#555",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  tryAgain: {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  home: {
    backgroundColor: "#ddd",
    color: "#222",
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
