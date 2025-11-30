"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { saveTest } from "../lib/firestore";
import { v4 as uuidv4 } from "uuid";

// ⭐ Modal component (copied from signuplogin & styled the same)
function LoginModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "40px",
          padding: "50px 40px",
          width: "95%",
          maxWidth: "540px",
          color: "black",
          fontFamily: "Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 10px 26px rgba(0,0,0,0.28)",
          border: "3px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "22px",
            background: "rgba(0,0,0,0.05)",
            border: "2px solid rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: "pointer",
            color: "black",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            marginBottom: "10px",
            fontWeight: 800,
            fontSize: "1.6rem",
            color: "black",
          }}
        >
          Sign In Required
        </h2>

        <p
          style={{
            marginBottom: "30px",
            opacity: 0.85,
            fontSize: "1.05rem",
            lineHeight: "1.45",
            color: "black",
          }}
        >
          To save your test results, please sign in below.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            width: "100%",
          }}
        >
          <Link
            href="/signup"
            style={{
              padding: "16px 0",
              borderRadius: "12px",
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: 700,
              fontSize: "1.05rem",
              textDecoration: "none",
              display: "block",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Sign Up
          </Link>

          <Link
            href="/login"
            style={{
              padding: "16px 0",
              borderRadius: "12px",
              border: "2px solid rgba(0,0,0,0.2)",
              backgroundColor: "rgba(0,0,0,0.04)",
              color: "black",
              fontWeight: 700,
              fontSize: "1.05rem",
              textDecoration: "none",
              display: "block",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResultsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [topic, setTopic] = useState("Unknown Topic");
  const [testData, setTestData] = useState(null);

  // ⭐ Modal visibility
  const [showModal, setShowModal] = useState(false);

  // Load test data from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("testData");

      if (stored) {
        const data = JSON.parse(stored);
        setTestData(data);

        const totalQuestions = data.questions?.length || 0;
        const correctCount = data.questions?.filter((q) => q.isCorrect)?.length || 0;

        setScore(correctCount);
        setTotal(totalQuestions);
        setTopic(data.topic || "Unknown Topic");
      } else {
        const scoreParam = parseInt(searchParams.get("score") || "0", 10);
        const totalParam = parseInt(searchParams.get("total") || "0", 10);
        const topicParam = searchParams.get("topic") || "Unknown Topic";

        setScore(scoreParam);
        setTotal(totalParam);
        setTopic(topicParam);
      }
    } catch (err) {
      console.error("Error parsing test data:", err);
    }
  }, [searchParams]);

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  function getMessage() {
    if (percent >= 90) return "🔥 Master Level! Excellent job!";
    if (percent >= 70) return "💪 Great work! You’re learning fast.";
    if (percent >= 50) return "🧠 Not bad — keep studying!";
    return "📘 Keep going — you’ll improve!";
  }

  function difficultyLabel(num) {
    if (num >= 1 && num <= 3) return "Beginner";
    if (num >= 4 && num <= 6) return "Apprentice";
    if (num >= 7 && num <= 9) return "Master";
    return "Unknown";
  }

  // ⭐ SAVE BUTTON
  const handleSave = async () => {
    if (!user) {
      setShowModal(true); // show modal instead of redirecting
      return;
    }

    const testId = uuidv4();
    const difficultyNum = testData?.difficulty || 1;

    const testToSave = {
      topic: testData?.topic || topic,
      type: testData?.type || "Unknown",
      difficulty: difficultyLabel(difficultyNum),
      difficultyNumber: difficultyNum,
      date: new Date().toISOString(),
      questions: testData?.questions || [],
      score,
      total,
      percent,
    };

    await saveTest(user.uid, testId, testToSave);
    router.push("/progress");
  };

  return (
    <>
      {/* ⭐ Render login modal if needed */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

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

          <p style={{ fontSize: "1.1rem", marginBottom: "30px", color: "#555" }}>
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
    </>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsInner />
    </Suspense>
  );
}
