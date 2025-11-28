"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllTests } from "../lib/firestore";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProgressPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const difficultyLabel = (num) => {
    const n = Number(num);
    if (n >= 1 && n <= 3) return "Beginner";
    if (n >= 4 && n <= 6) return "Apprentice";
    if (n >= 7 && n <= 9) return "Master";
    return "Unknown";
  };

  useEffect(() => {
    const fallbackLoadLocal = () => {
      try {
        const local = JSON.parse(localStorage.getItem("savedTests") || "[]");
        const normalized = local.map((t, i) => ({
          ...t,
          id: t.id || `local-${i}`,
          questions: Array.isArray(t.questions) ? t.questions : [],
          difficultyNumber: Number(t.difficultyNumber || t.difficulty || 1),
        }));
        setTests(normalized);
      } catch {
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    if (!user?.uid) {
      fallbackLoadLocal();
      return;
    }

    const fetchTests = async () => {
      try {
        const docs = await getAllTests(user.uid);
        const safeDocs = docs.map((t) => ({
          ...t,
          questions: Array.isArray(t.questions) ? t.questions : [],
          difficultyNumber: Number(t.difficultyNumber || 1),
        }));
        setTests(safeDocs);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to load saved tests — using local fallback.");
        fallbackLoadLocal();
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user]);

  const totalTests = tests.length;
  const avgPercent = totalTests
    ? Math.round(tests.reduce((acc, t) => acc + (Number(t.percent) || 0), 0) / totalTests)
    : 0;

  const avgNumQuestions = totalTests
    ? Math.round(
        tests.reduce(
          (acc, t) => acc + (Array.isArray(t.questions) ? t.questions.length : 0),
          0
        ) / totalTests
      )
    : 0;

  const avgDifficultyNumber = totalTests
    ? Math.round(
        tests.reduce((acc, t) => acc + (Number(t.difficultyNumber) || 1), 0) /
          totalTests
      )
    : 0;

  const avgDifficultyLabel = difficultyLabel(avgDifficultyNumber);

  const mostUsedType = (() => {
    if (!totalTests) return "—";
    const counts = {};
    tests.forEach((t) => {
      const k = t.type || "Unknown";
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  const mostUsedTopic = (() => {
    if (!totalTests) return "—";
    const counts = {};
    tests.forEach((t) => {
      const k = t.topic || "Unknown";
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  const bestTest = tests.length
    ? [...tests].sort((a, b) => (b.percent || 0) - (a.percent || 0))[0]
    : null;

  // DELETE TEST
  const handleDelete = async (testId, index) => {
    const confirmDelete = confirm("Delete this saved test? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      if (user?.uid && testId && !String(testId).startsWith("local-")) {
        await deleteDoc(doc(db, "users", user.uid, "data", testId));
        setTests((prev) => prev.filter((t) => t.id !== testId));
      } else {
        const newTests = tests.filter((_, i) => i !== index);
        setTests(newTests);
        localStorage.setItem("savedTests", JSON.stringify(newTests));
      }
    } catch (err) {
      console.error("Failed to delete test", err);
      alert("Failed to delete test.");
    }
  };

  // Button Styles
  const btn = {
    padding: "8px 12px",
    background: "white",
    border: "2px solid #1976d2",
    color: "#1976d2",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  };

  const deleteBtn = {
    ...btn,
    border: "2px solid #d32f2f",
    color: "#d32f2f",
  };

  const restartBtn = {
    ...btn,
    border: "2px solid #ff9800",
    color: "#ff9800",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "92%",
          maxWidth: "980px",
          backgroundColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          borderRadius: "36px",
          border: "3px solid rgba(255,255,255,0.18)",
          padding: "40px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontWeight: 800 }}>
          Your Progress
        </h1>

        {/* TOP STATS */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          {/* WHITE CARDS */}
          {[ 
            { label: "Average Score", value: tests.length ? `${avgPercent}%` : "0%" },
            { label: "Avg Number of Questions", value: tests.length ? avgNumQuestions : 0 },
            { label: "Avg Difficulty", value: tests.length ? avgDifficultyLabel : "—" },
            { label: "Most Used Test Type", value: tests.length ? mostUsedType : "—" },
            { label: "Most Common Topic", value: tests.length ? mostUsedTopic : "—" }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "white",
                color: "black",
                borderRadius: "16px",
                border: "3px solid rgba(0,0,0,0.2)",
                padding: "20px",
                textAlign: "center",
                minWidth: "160px",
              }}
            >
              <h2 style={{ margin: 0 }}>{item.value}</h2>
              <p style={{ fontSize: "0.9rem", marginTop: 6 }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* BEST TEST */}
        <div
          style={{
            background: "white",
            color: "black",
            borderRadius: "20px",
            padding: "24px",
            border: "2px solid rgba(0,0,0,0.25)",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ fontWeight: 700 }}>Your Best Test Ever</h2>
          {bestTest ? (
            <p>
              Topic: <b>{bestTest.topic}</b> — Score:{" "}
              <b>{bestTest.score}/{bestTest.total}</b> ({bestTest.percent}%)
            </p>
          ) : (
            <p>No test data yet.</p>
          )}
        </div>

        {/* SAVED TESTS */}
        <h2 style={{ marginBottom: "20px", fontWeight: 700 }}>Your Saved Tests</h2>

        {tests.length === 0 ? (
          <p style={{ textAlign: "center" }}>No saved tests yet.</p>
        ) : (
          tests.map((test, index) => (
            <div
              key={test.id || index}
              style={{
                background: "white",
                color: "black",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "18px",
                border: "2px solid rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{test.topic}</h3>
                  <p style={{ margin: 0 }}>
                    Score: {test.score}/{test.total} ({test.percent}%) —{" "}
                    {(test.questions || []).length} questions — Difficulty:{" "}
                    {difficultyLabel(test.difficultyNumber)}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    style={btn}
                  >
                    👁
                  </button>

                  <button
                    onClick={() => router.push(`/testretake?testId=${test.id}`)}
                    style={restartBtn}
                  >
                    ↻
                  </button>

                  <button
                    onClick={() => handleDelete(test.id, index)}
                    style={deleteBtn}
                  >
                    🗑
                  </button>
                </div>
              </div>

              {expandedIndex === index && (
                <div style={{ marginTop: "14px" }}>
                  {(test.questions || []).map((q, i) => (
                    <div key={i} style={{ marginBottom: "12px" }}>
                      <p>
                        <b>Q{i + 1}:</b> {q.question}
                      </p>
                      <p>User Answer: {q.userAnswer}</p>
                      <p>Correct Answer: {q.correctAnswer}</p>
                      {q.explanation && <p>Explanation: {q.explanation}</p>}
                      <p style={{ color: q.isCorrect ? "green" : "red" }}>
                        {q.isCorrect ? "Correct" : "Incorrect"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
