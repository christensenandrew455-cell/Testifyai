"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllTests } from "../lib/firestore";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
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

// ---------- STAT CARD COMPONENT ----------
const StatCard = ({ title, value, subtitle }) => (
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

// ---------- RETAKE MODAL COMPONENT ----------
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
          Would you like to retake the exact same test, or take a revised version
          with similar questions worded differently?
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

// ---------- TEST CARD COMPONENT ----------
const TestCard = ({ test, expanded, onExpandToggle, onRetake, onDelete, isBest }) => {
  const difficultyLabel = (num) => {
    const n = Number(num);
    if (n >= 1 && n <= 3) return "Beginner";
    if (n >= 4 && n <= 6) return "Apprentice";
    if (n >= 7 && n <= 9) return "Master";
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
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1.3rem", color: cardTextColor }}>{test.topic}</h3>
          <p style={{ margin: "6px 0", color: cardTextColor }}>
            Score: {test.score}/{test.total} ({test.percent}%) — {(test.questions || []).length} questions — Difficulty: {difficultyLabel(test.difficultyNumber)}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => onRetake(test.id)} style={restartBtnStyle}>Retake</button>
          <button onClick={onExpandToggle} style={viewBtnStyle}>View</button>
          <button onClick={() => onDelete(test.id)} style={deleteBtnStyle}>Delete</button>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: "14px", paddingLeft: "10px" }}>
          {(test.questions || []).map((q, i) => (
            <div key={i} style={{ marginBottom: "12px", color: cardTextColor }}>
              <p><b>Q{i+1}:</b> {q.question}</p>
              <p>User Answer: {q.userAnswer}</p>
              <p>Correct Answer: {q.correctAnswer}</p>
              {q.explanation && <p>Explanation: {q.explanation}</p>}
              <p style={{ color: q.isCorrect ? "green" : "red" }}>{q.isCorrect ? "Correct" : "Incorrect"}</p>
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
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [retakeModalOpen, setRetakeModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);

  const router = useRouter();

  // ---------- HELPER FUNCTIONS ----------
  const difficultyLabel = (num) => {
    const n = Number(num);
    if (n >= 1 && n <= 3) return "Beginner";
    if (n >= 4 && n <= 6) return "Apprentice";
    if (n >= 7 && n <= 9) return "Master";
    return "Unknown";
  };

  const fetchTestsData = async () => {
    if (!user?.uid) {
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
      return;
    }

    try {
      const docs = await getAllTests(user.uid);
      const safeDocs = docs.map((t) => ({
        ...t,
        questions: Array.isArray(t.questions) ? t.questions : [],
        difficultyNumber: Number(t.difficultyNumber || 1),
      }));
      setTests(safeDocs);
    } catch (err) {
      console.error(err);
      setError("Failed to load saved tests — using local fallback.");
      const local = JSON.parse(localStorage.getItem("savedTests") || "[]");
      setTests(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestsData();
  }, [user]);

  const handleDelete = async (testId) => {
    const confirmDelete = confirm("Delete this saved test? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      if (user?.uid && testId && !String(testId).startsWith("local-")) {
        await deleteDoc(doc(db, "users", user.uid, "data", testId));
        setTests(prev => prev.filter(t => t.id !== testId));
      } else {
        const newTests = tests.filter(t => t.id !== testId);
        setTests(newTests);
        localStorage.setItem("savedTests", JSON.stringify(newTests));
      }
    } catch {
      alert("Failed to delete test.");
    }
  };

  const openRetakeModal = (testId) => {
    setSelectedTestId(testId);
    setRetakeModalOpen(true);
  };

  const closeModal = () => {
    setRetakeModalOpen(false);
    setSelectedTestId(null);
  };

  const handleRetake = async () => {
    if (!selectedTestId) return;
    try {
      await fetch("/api/retake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: selectedTestId }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      closeModal();
      router.push(`/testcontroller?mode=retake&testId=${encodeURIComponent(selectedTestId)}`);
    }
  };

  const handleRevised = async () => {
    if (!selectedTestId) return;
    try {
      await fetch("/api/revised", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: selectedTestId }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      closeModal();
      router.push(`/testcontroller?mode=revised&testId=${encodeURIComponent(selectedTestId)}`);
    }
  };

  // ---------- COMPUTED STATS ----------
  const totalTests = tests.length;

  // New bestTest logic
  const bestTest = totalTests
    ? [...tests].sort((a, b) => {
        const aWeighted = (a.percent || 0) * ((a.questions?.length || 1));
        const bWeighted = (b.percent || 0) * ((b.questions?.length || 1));
        if (bWeighted !== aWeighted) return bWeighted - aWeighted;

        const aDiff = Number(a.difficultyNumber || 1);
        const bDiff = Number(b.difficultyNumber || 1);
        if (bDiff !== aDiff) return bDiff - aDiff;

        return 0;
      })[0]
    : null;

  const avgPercent = totalTests ? Math.round(tests.reduce((a, t) => a + (Number(t.percent) || 0), 0) / totalTests) : 0;
  const avgNumQuestions = totalTests ? Math.round(tests.reduce((a, t) => a + ((t.questions || []).length || 0), 0) / totalTests) : 0;
  const avgDifficultyNumber = totalTests ? Math.round(tests.reduce((a, t) => a + (Number(t.difficultyNumber) || 1), 0) / totalTests) : 0;
  const avgDifficultyLabel = difficultyLabel(avgDifficultyNumber);

  const mostUsedType = (() => {
    if (!totalTests) return "—";
    const counts = {};
    tests.forEach(t => counts[t.type || "Unknown"] = (counts[t.type || "Unknown"] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  const mostUsedTopic = (() => {
    if (!totalTests) return "—";
    const counts = {};
    tests.forEach(t => counts[t.topic || "Unknown"] = (counts[t.topic || "Unknown"] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  return (
    <>
      <RetakeModal open={retakeModalOpen} onClose={closeModal} onRetake={handleRetake} onRevised={handleRevised} />

      <div style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif"
      }}>
        <div style={{
          width: "92%",
          maxWidth: "980px",
          backgroundColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          borderRadius: "36px",
          border: "3px solid rgba(255,255,255,0.18)",
          padding: "40px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)"
        }}>
          <h1 style={{ textAlign: "center", marginBottom: "30px", fontWeight: 800 }}>Your Progress</h1>

          {error && <div style={{ marginBottom: 12, color: "#ffdddd", textAlign: "center" }}>{error}</div>}

          {/* Top Stats */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "nowrap", justifyContent: "center", marginBottom: "40px", overflowX: "auto" }}>
            <StatCard value={`${avgPercent}%`} subtitle="Average Score" />
            <StatCard value={avgNumQuestions} subtitle="Avg Number of Questions" />
            <StatCard value={avgDifficultyLabel} subtitle="Avg Difficulty" />
            <StatCard value={mostUsedType} subtitle="Total Tests Taken" />
            <StatCard value={mostUsedTopic} subtitle="Most Common Topic" />
          </div>

          {/* Best Test */}
          {bestTest && <h2 style={{ marginBottom: "20px", fontWeight: 700, color: "white" }}>Your Best Test Ever</h2>}
          {bestTest && <TestCard
            test={bestTest}
            expanded={expandedIndex === -1}
            onExpandToggle={() => setExpandedIndex(expandedIndex === -1 ? null : -1)}
            onRetake={openRetakeModal}
            onDelete={handleDelete}
            isBest
          />}

          {/* Saved Tests */}
          <h2 style={{ marginBottom: "20px", fontWeight: 700, color: "white" }}>Your Saved Tests</h2>
          {tests.filter(t => t !== bestTest).length === 0
            ? <p style={{ textAlign: "center", opacity: 0.8, color: "white" }}>No saved tests yet.</p>
            : tests.filter(t => t !== bestTest).map((test, index) => (
              <TestCard
                key={test.id || index}
                test={test}
                expanded={expandedIndex === index}
                onExpandToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                onRetake={openRetakeModal}
                onDelete={handleDelete}
              />
            ))
          }
        </div>
      </div>
    </>
  );
}
