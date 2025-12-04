"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { saveTest, incrementTestCount } from "../lib/firestore"; // ⭐ NEW
import { v4 as uuidv4 } from "uuid";

// ⭐ Modal
function LoginModal({ onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
      background: "rgba(0,0,0,0.25)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 9999
    }}>
      <div style={{
        background: "white",
        borderRadius: "40px",
        padding: "50px 40px",
        width: "95%",
        maxWidth: "540px",
        color: "black",
        textAlign: "center",
        position: "relative",
        boxShadow: "0 10px 26px rgba(0,0,0,0.28)",
        border: "3px solid rgba(0,0,0,0.06)"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "22px",
            background: "rgba(0,0,0,0.05)",
            border: "2px solid rgba(0,0,0,0.15)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: "pointer",
            color: "black"
          }}
        >
          ✕
        </button>

        <h2 style={{ fontWeight: 800, fontSize: "1.6rem" }}>Sign In Required</h2>
        <p style={{ marginBottom: "30px", opacity: 0.85 }}>
          To save your test results, please sign in below.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
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
              display: "block"
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
              display: "block"
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

  const [showModal, setShowModal] = useState(false);

  // ⭐ Load test data
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
      console.error("Error loading test data:", err);
    }
  }, [searchParams]);

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  // ⭐ NEW: Automatically count test as "taken"
  useEffect(() => {
    if (!topic || total === 0) return;

    const increment = async () => {
      if (user?.uid) {
        await incrementTestCount(user.uid);
      } else {
        // guest mode
        const current = parseInt(localStorage.getItem("testsTaken") || "0", 10);
        localStorage.setItem("testsTaken", current + 1);
      }
    };

    increment();
  }, [user, total, topic]);

  function difficultyLabel(num) {
    if (num >= 1 && num <= 3) return "Beginner";
    if (num >= 4 && num <= 6) return "Apprentice";
    if (num >= 7 && num <= 9) return "Master";
    return "Unknown";
  }

  // ⭐ SAVE manually
  const handleSave = async () => {
    if (!user) {
      setShowModal(true);
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
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        padding: "40px 20px"
      }}>
        <div style={{
          border: "3px solid #1976d2",
          borderRadius: "24px",
          backgroundColor: "white",
          padding: "40px",
          textAlign: "center",
          width: "100%",
          maxWidth: "600px"
        }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1976d2" }}>
            Your Results
          </h1>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>{topic}</h2>

          <p style={{ fontSize: "1.8rem", fontWeight: 800 }}>{score} / {total}</p>

          <p style={{ fontSize: "1.3rem", fontWeight: 600 }}>{percent}%</p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <Link href="/">
              <button style={{
                backgroundColor: "#e0e0e0",
                padding: "10px 20px",
                borderRadius: "12px",
                fontWeight: 700
              }}>
                Home
              </button>
            </Link>

            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "12px",
                padding: "10px 20px",
                fontWeight: 700
              }}
            >
              Save
            </button>
          </div>
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
