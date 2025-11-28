"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// Replace this with your real auth system
const useUser = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  return user;
};

function ResultsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useUser();

  const [testData, setTestData] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [topic, setTopic] = useState("Unknown Topic");

  // Load test data either from sessionStorage or URL params
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        setTestData(data);

        const questions = Array.isArray(data.questions) ? data.questions : [];
        const correctCount = questions.filter((q) => q.isCorrect).length;
        const testTopic = questions[0]?.topic || "Unknown Topic";

        setScore(correctCount);
        setTotal(questions.length);
        setTopic(testTopic);
      } else {
        // fallback to URL params
        const scoreParam = parseInt(searchParams.get("score") || "0", 10);
        const totalParam = parseInt(searchParams.get("total") || "0", 10);
        const topicParam = searchParams.get("topic") || "Unknown Topic";

        setScore(scoreParam);
        setTotal(totalParam);
        setTopic(topicParam);
      }
    } catch (err) {
      console.error("Error loading test data:", err);
    }
  }, [searchParams]);

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const getMessage = () => {
    if (percent >= 90) return "🔥 Master Level! Excellent job!";
    if (percent >= 70) return "💪 Great work! You’re learning fast.";
    if (percent >= 50) return "🧠 Not bad — keep studying!";
    return "📘 Keep going — you’ll improve!";
  };

  const handleSave = () => {
    if (!user) {
      router.push("/signuplogin");
      return;
    }

    if (!testData) return;

    const savedTests = JSON.parse(localStorage.getItem("savedTests") || "[]");
    savedTests.push(testData); // push current test
    localStorage.setItem("savedTests", JSON.stringify(savedTests));

    router.push("/progress");
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

          <button
            onClick={handleSave}
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
            Save
          </button>
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
