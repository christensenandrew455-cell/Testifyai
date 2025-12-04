"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllTests } from "../lib/firestore";
import { db } from "../firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// ---------- STYLE CONSTANTS ----------
const cardTextColor = "#666";
const restartBtnStyle = {
  padding: "8px 12px",
  background: "#ff9800",
  border: "2px solid rgba(0,0,0,0.08)",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 700,
};
const viewBtnStyle = {
  padding: "8px 12px",
  background: "#1976d2",
  border: "2px solid rgba(0,0,0,0.08)",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 700,
};
const deleteBtnStyle = {
  padding: "8px 12px",
  background: "#d32f2f",
  border: "2px solid rgba(0,0,0,0.08)",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 700,
};

// ---------- STAT CARD ----------
const StatCard = ({ value, subtitle }) => (
  <div style={{
    background: "white",
    borderRadius: "16px",
    border: "3px solid rgba(0,0,0,0.12)",
    padding: "20px",
    textAlign: "center",
    minWidth: "160px",
    color: cardTextColor,
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
  }}>
    <h2 style={{ margin: 0, color: cardTextColor }}>{value}</h2>
    <p style={{ fontSize: "0.9rem", color: cardTextColor }}>{subtitle}</p>
  </div>
);

// ---------- RETAKE MODAL ----------
const RetakeModal = ({ open, onClose, onRetake, onRevised }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0,
      width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "18px",
        width: "90%",
        maxWidth: "480px",
        textAlign: "center",
        boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        color: cardTextColor
      }}>
        <h2 style={{ marginBottom: "12px", color: cardTextColor }}>Retake Options</h2>
        <p style={{ color: cardTextColor, marginBottom: "22px" }}>
          Retake the same test or get a revised version?
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
          <button onClick={onRetake} style={{
            padding: "10px 16px",
            background: "#1976d2",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700
          }}>Retake</button>

          <button onClick={onRevised} style={{
            padding: "10px 16px",
            background: "#ff9800",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700
          }}>Revised</button>
        </div>

        <button onClick={onClose} style={{
          marginTop: "18px",
          background: "transparent",
          border: "none",
          textDecoration: "underline",
          color: "#444",
          cursor: "pointer"
        }}>Cancel</button>
      </div>
    </div>
  );
};

// ---------- TEST CARD ----------
const TestCard = ({ test, expanded, onExpandToggle, onRetake, onDelete, isBest }) => {
  const difficultyLabel = (num) => {
    const n = Number(num);
    if (n <= 3) return "Beginner";
    if (n <= 6) return "Apprentice";
    if (n <= 9) return "Master";
    return "Unknown";
  };

  return (
    <div style={{
      background: "white",
      color: cardTextColor,
      borderRadius: isBest ? "20px" : "12px",
      padding: isBest ? "24px" : "15px",
      marginBottom: "18px",
      border: isBest ? "3px solid gold" : "2px solid rgba(0,0,0,0.06)",
      boxShadow: isBest ? "0 10px 30px rgba(0,0,0,0.25)" : "none"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontWeight: 700, color: cardTextColor }}>{test.topic}</h3>
          <p style={{ margin: "6px 0" }}>
            Score: {test.score}/{test.total} ({test.percent}%) — Difficulty: {difficultyLabel(test.difficultyNumber)}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => onRetake(test.id)} style={restartBtnStyle}>Retake</button>
          <button onClick={onExpandToggle} style={viewBtnStyle}>View</button>
          <button onClick={() => onDelete(test.id)} style={deleteBtnStyle}>Delete</button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: "14px" }}>
          {(test.questions || []).map((q, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <p><b>Q{i + 1}:</b> {q.question}</p>
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
  );
};

// ---------- MAIN PAGE ----------
export default function ProgressPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [testsTaken, setTestsTaken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);

  const [retakeModalOpen, setRetakeModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);

  const router = useRouter();

  // ---------- LOAD Firestore Stats ----------
  const fetchStats = async () => {
    if (!user?.uid) return;

    try {
      const ref = doc(db, "users", user.uid, "stats", "progress");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTestsTaken(snap.data().testsTaken || 0);
      } else {
        setTestsTaken(0);
      }
    } catch (err) {
      console.error("stats error:", err);
      setTestsTaken(0);
    }
  };

  // ---------- LOAD Tests ----------
  const fetchTestsData = async () => {
    if (!user?.uid) {
      // Guest mode
      try {
        const local = JSON.parse(localStorage.getItem("savedTests") || "[]");
        setTests(local);
      } catch {
        setTests([]);
      }
      setLoading(false);
      return;
    }

    try {
      const docs = await getAllTests(user.uid);
      setTests(docs);
    } catch {
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTestsData();
    fetchStats();
  }, [user]);

  // ---------- COMPUTED STATS ----------
  const totalSaved = tests.length;
  const avgPercent = totalSaved
    ? Math.round(tests.reduce((a, t) => a + (Number(t.percent) || 0), 0) / totalSaved)
    : 0;

  const avgDifficultyNumber = totalSaved
    ? Math.round(tests.reduce((a, t) => a + (Number(t.difficultyNumber) || 1), 0) / totalSaved)
    : 0;

  const difficultyLabel = (num) => {
    const n = Number(num);
    if (n <= 3) return "Beginner";
    if (n <= 6) return "Apprentice";
    return "Master";
  };

  const avgDifficulty = difficultyLabel(avgDifficultyNumber);

  // ---------- BEST TEST ----------
  const bestTest = totalSaved
    ? [...tests].sort((a, b) => (b.percent || 0) - (a.percent || 0))[0]
    : null;

  // ---------- Delete ----------
  const handleDelete = async (testId) => {
    const ok = confirm("Delete this test?");
    if (!ok) return;

    try {
      if (user?.uid) {
        await deleteDoc(doc(db, "users", user.uid, "data", testId));
      }
      setTests(prev => prev.filter(t => t.id !== testId));
    } catch {}
  };

  // ---------- Modal Controls ----------
  const openRetakeModal = (id) => {
    setSelectedTestId(id);
    setRetakeModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTestId(null);
    setRetakeModalOpen(false);
  };

  const handleRetake = () => {
    router.push(`/testcontroller?mode=retake&testId=${selectedTestId}`);
  };

  const handleRevised = () => {
    router.push(`/testcontroller?mode=revised&testId=${selectedTestId}`);
  };

  // ---------- PAGE ----------
  return (
    <>
      <RetakeModal
        open={retakeModalOpen}
        onClose={closeModal}
        onRetake={handleRetake}
        onRevised={handleRevised}
      />

      <div style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        color: "white"
      }}>
        <div style={{
          width: "92%",
          maxWidth: "980px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          borderRadius: "36px",
          border: "3px solid rgba(255,255,255,0.18)",
          padding: "40px"
        }}>

          <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Your Progress</h1>

          {/* Stats */}
          <div style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "40px"
          }}>
            <StatCard value={testsTaken} subtitle="Total Tests Taken" />
            <StatCard value={`${avgPercent}%`} subtitle="Avg Score (Saved Tests)" />
            <StatCard value={avgDifficulty} subtitle="Avg Difficulty" />
          </div>

          {/* Best Test */}
          {bestTest && (
            <>
              <h2>Your Best Saved Test</h2>
              <TestCard
                test={bestTest}
                expanded={expandedIndex === -1}
                onExpandToggle={() => setExpandedIndex(expandedIndex === -1 ? null : -1)}
                onRetake={openRetakeModal}
                onDelete={handleDelete}
                isBest
              />
            </>
          )}

          {/* Saved Tests */}
          <h2>Your Saved Tests</h2>
          {tests.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No saved tests yet.</p>
          ) : (
            tests
              .filter(t => t !== bestTest)
              .map((test, i) => (
                <TestCard
                  key={test.id}
                  test={test}
                  expanded={expandedIndex === i}
                  onExpandToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  onRetake={openRetakeModal}
                  onDelete={handleDelete}
                />
              ))
          )}
        </div>
      </div>
    </>
  );
}
