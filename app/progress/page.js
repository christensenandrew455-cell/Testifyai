"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase"; // make sure your firebase file exports `db` (Firestore)
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function ProgressPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);

  // Difficulty label helper (force numeric)
  const difficultyLabel = (num) => {
    const n = Number(num);
    if (n >= 1 && n <= 3) return "Beginner";
    if (n >= 4 && n <= 6) return "Apprentice";
    if (n >= 7 && n <= 9) return "Master";
    return "Unknown";
  };

  useEffect(() => {
    let unsubscribe = null;

    const fallbackLoadLocal = () => {
      try {
        const local = JSON.parse(localStorage.getItem("savedTests") || "[]");
        // Ensure each item has id (for UI) when loading from localStorage
        const normalized = local.map((t, i) => ({ ...t, id: t.id || `local-${i}` }));
        setTests(normalized);
      } catch (e) {
        console.error("Failed parsing local savedTests", e);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    if (!user?.uid) {
      // Not signed in — try localStorage fallback
      fallbackLoadLocal();
      return;
    }

    try {
      // Read from Firestore: users/{uid}/savedTests, ordered by date desc
      const colRef = collection(db, "users", user.uid, "savedTests");
      const q = query(colRef, orderBy("date", "desc"));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setTests(docs);
          setLoading(false);
        },
        (err) => {
          console.error("Firestore onSnapshot error", err);
          setError("Failed to load saved tests from Firestore — using local fallback.");
          // fallback to local
          fallbackLoadLocal();
        }
      );
    } catch (err) {
      console.error("Error querying Firestore", err);
      setError("Failed to load saved tests from Firestore — using local fallback.");
      fallbackLoadLocal();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Stats calculations
  const totalTests = tests.length;

  const avgPercent = totalTests
    ? Math.round(tests.reduce((acc, t) => acc + (Number(t.percent) || 0), 0) / totalTests)
    : 0;

  // Average number of questions per test (single number)
  const avgNumQuestions = totalTests
    ? Math.round(
        tests.reduce((acc, t) => acc + (Array.isArray(t.questions) ? t.questions.length : 0), 0) /
          totalTests
      )
    : 0;

  // Average difficulty numeric (then will be converted to label)
  const avgDifficultyNumber = totalTests
    ? Math.round(
        tests.reduce((acc, t) => acc + (Number(t.difficulty) || Number(t.difficultyNumber) || 1), 0) /
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

  // Best test by percent (desc)
  const bestTest = tests.length ? [...tests].sort((a, b) => (b.percent || 0) - (a.percent || 0))[0] : null;

  // Delete a test (Firestore if signed in, else localStorage fallback)
  const handleDelete = async (testId, index) => {
    const confirmDelete = confirm("Delete this saved test? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      if (user?.uid && testId && !String(testId).startsWith("local-")) {
        // Delete from Firestore
        await deleteDoc(doc(db, "users", user.uid, "savedTests", testId));
        // onSnapshot will update UI
      } else {
        // Local fallback: delete from localStorage
        const newTests = tests.filter((_, i) => i !== index);
        setTests(newTests);
        localStorage.setItem("savedTests", JSON.stringify(newTests));
      }
    } catch (err) {
      console.error("Failed to delete test", err);
      alert("Failed to delete test. See console for details.");
    }
  };

  // Helpers for styles (kept small and inline to match your previous design)
  const grayCardStyle = {
    background: "rgba(255,255,255,0.12)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    flex: 1,
    minWidth: "160px",
    border: "2px solid rgba(255,255,255,0.25)",
    color: "rgba(255,255,255,0.9)",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    border: "3px solid rgba(255,255,255,0.35)",
    padding: "20px",
    textAlign: "center",
    flex: 1,
    minWidth: "160px",
    color: "white",
    boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
  };

  const btnStyle = {
    padding: "8px 12px",
    background: "rgba(25,118,210,0.4)",
    border: "2px solid rgba(255,255,255,0.25)",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const deleteBtnStyle = {
    padding: "8px 12px",
    background: "rgba(211,47,47,0.5)",
    border: "2px solid rgba(255,255,255,0.25)",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
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
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontWeight: 800 }}>
          Your Progress
        </h1>

        {error && (
          <div style={{ marginBottom: 12, color: "#ffdddd", textAlign: "center" }}>{error}</div>
        )}

        {/* ===========================
            TOP FIVE STATS
        ============================ */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          {/* AVG PERCENTAGE */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 10px",
                borderRadius: "50%",
                border: "6px solid rgba(255,255,255,0.25)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.2rem",
              }}
            >
              {tests.length === 0 ? "0%" : `${avgPercent}%`}
            </div>
            <p style={{ fontSize: "0.9rem" }}>Average Score</p>
          </div>

          {/* AVG QUESTIONS */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <h2 style={{ margin: 0 }}>{tests.length === 0 ? 0 : avgNumQuestions}</h2>
            <p style={{ fontSize: "0.9rem" }}>Avg Number of Questions</p>
          </div>

          {/* AVG DIFFICULTY */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <h2 style={{ margin: 0 }}>{tests.length === 0 ? "—" : avgDifficultyLabel}</h2>
            <p style={{ fontSize: "0.9rem" }}>Avg Difficulty</p>
          </div>

          {/* MOST USED TEST TYPE */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <h2 style={{ margin: 0 }}>{tests.length === 0 ? "—" : mostUsedType}</h2>
            <p style={{ fontSize: "0.9rem" }}>Most Used Test Type</p>
          </div>

          {/* MOST USED TOPIC */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <h2 style={{ margin: 0 }}>{tests.length === 0 ? "—" : mostUsedTopic}</h2>
            <p style={{ fontSize: "0.9rem" }}>Most Common Topic</p>
          </div>
        </div>

        {/* ===========================
            BEST TEST EVER
        ============================ */}
        <div
          style={{
            background: tests.length === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "40px",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          <h2 style={{ marginBottom: "10px", fontWeight: 700 }}>Your Best Test Ever</h2>
          {tests.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No test data yet</p>
          ) : (
            <p style={{ opacity: 0.95 }}>
              Topic: <b>{bestTest.topic}</b> — Score: <b>{bestTest.score}/{bestTest.total}</b> ({bestTest.percent}%)
            </p>
          )}
        </div>

        {/* ===========================
            SAVED TESTS LIST
        ============================ */}
        <h2 style={{ marginBottom: "20px", fontWeight: 700 }}>Your Saved Tests</h2>

        {tests.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>No saved tests yet.</p>
        ) : (
          tests.map((test, index) => (
            <div
              key={test.id || index}
              style={{
                background: "rgba(255,255,255,0.18)",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "18px",
                border: "2px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
                color: "white",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <h3 style={{ margin: 0, fontWeight: 700 }}>{test.topic}</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>
                    Score: {test.score}/{test.total} ({test.percent}%) — {test.questions.length} questions — Difficulty: {difficultyLabel(test.difficulty || test.difficultyNumber)}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    style={btnStyle}
                  >
                    👁
                  </button>

                  <button onClick={() => handleDelete(test.id, index)} style={deleteBtnStyle}>
                    🗑
                  </button>
                </div>
              </div>

              {/* EXPANDED SECTION */}
              {expandedIndex === index && (
                <div style={{ marginTop: "14px", paddingLeft: "10px" }}>
                  {test.questions.map((q, i) => (
                    <div key={i} style={{ marginBottom: "12px" }}>
                      <p><b>Q{i + 1}:</b> {q.question}</p>
                      <p>User Answer: {q.userAnswer}</p>
                      <p>Correct Answer: {q.correctAnswer}</p>
                      {q.explanation && <p>Explanation: {q.explanation}</p>}
                      <p style={{ color: q.isCorrect ? "#00ff95" : "#ff7b7b" }}>
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
