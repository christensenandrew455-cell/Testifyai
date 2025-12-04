"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllTests } from "../lib/firestore";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// ---- ADDED: Small helper to decode answer index → text ----
function getAnswerText(q, index) {
  if (!Number.isInteger(index)) return "";
  if (q.answers && q.answers[index]) return q.answers[index];
  const fallback = ["A", "B", "C", "D", "E", "F"];
  return fallback[index] || `Choice ${index}`;
}

// ---------- STYLE CONSTANTS ----------
const cardTextColor = "#666";
const darkGray = "#333"; // NEW
const restartBtnStyle = { padding: "8px 12px", background: "#ff9800", border: "2px solid rgba(0,0,0,0.08)", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: 700 };
const viewBtnStyle = { padding: "8px 12px", background: "#1976d2", border: "2px solid rgba(0,0,0,0.08)", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: 700 };
const deleteBtnStyle = { padding: "8px 12px", background: "#d32f2f", border: "2px solid rgba(0,0,0,0.08)", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: 700 };

// ---------- STAT CARD ----------
const StatCard = ({ value, subtitle }) => (
  <div style={{ background: "white", borderRadius: "16px", border: "3px solid rgba(0,0,0,0.12)", padding: "20px", textAlign: "center", minWidth: "160px", color: cardTextColor, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
    <h2 style={{ margin: 0, color: cardTextColor }}>{value}</h2>
    <p style={{ fontSize: "0.9rem", color: cardTextColor }}>{subtitle}</p>
  </div>
);

// ---------- RETAKE MODAL ----------
const RetakeModal = ({ open, onClose, onRetake, onRevised }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "white", padding: "30px", borderRadius: "18px", width: "90%", maxWidth: "480px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.25)", color: cardTextColor }}>
        <h2 style={{ marginBottom: "12px", color: cardTextColor }}>Retake Options</h2>
        <p style={{ color: cardTextColor, marginBottom: "22px" }}>Would you like to retake the exact same test, or take a revised version with similar questions worded differently?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
          <button onClick={onRetake} style={{ padding: "10px 16px", background: "#1976d2", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700 }}>Retake</button>
          <button onClick={onRevised} style={{ padding: "10px 16px", background: "#ff9800", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700 }}>Revised</button>
        </div>
        <button onClick={onClose} style={{ marginTop: "18px", background: "transparent", border: "none", textDecoration: "underline", color: "#444", cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
};

// ---------- TEST CARD ----------
const TestCard = ({ test, expanded, onExpandToggle, onRetake, onDelete, isBest }) => {
  const difficultyLabel = (n) => (n <= 3 ? "Beginner" : n <= 6 ? "Apprentice" : "Master");

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
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1.3rem", color: darkGray }}>{test.topic}</h3>
          <p style={{ margin: "6px 0", color: darkGray }}>
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
        <div style={{ marginTop: "14px", paddingLeft: "10px", color: cardTextColor }}>
          {(test.questions || []).map((q, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>

              <p><b>Q{i + 1}:</b> {q.question}</p>
              <p>User Answer: {getAnswerText(q, q.userAnswer)}</p>
              <p>Correct Answer: {getAnswerText(q, q.correctAnswer)}</p>
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
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [retakeModalOpen, setRetakeModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const router = useRouter();

  const fetchTestsData = async () => {
    if (!user?.uid) {
      const local = JSON.parse(localStorage.getItem("savedTests") || "[]");
      const normalized = local.map((t, i) => ({
        ...t,
        id: t.id || `local-${i}`,
        questions: Array.isArray(t.questions) ? t.questions : [],
        difficultyNumber: Number(t.difficultyNumber || t.difficulty || 1),
      }));
      setTests(normalized);
      setLoading(false);
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
    } catch {
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
    const ok = confirm("Delete this saved test? This cannot be undone.");
    if (!ok) return;

    try {
      if (user?.uid && !String(testId).startsWith("local-")) {
        await deleteDoc(doc(db, "users", user.uid, "data", testId));
      }
      const newTests = tests.filter((t) => t.id !== testId);
      setTests(newTests);
      localStorage.setItem("savedTests", JSON.stringify(newTests));
    } catch {
      alert("Failed to delete test.");
    }
  };

  const openRetakeModal = (id) => {
    setSelectedTestId(id);
    setRetakeModalOpen(true);
  };

  const closeModal = () => {
    setRetakeModalOpen(false);
    setSelectedTestId(null);
  };

  const handleRetake = async () => {
    await fetch("/api/retake", { method: "POST", body: JSON.stringify({ testId: selectedTestId }), headers: { "Content-Type": "application/json" } });
    router.push(`/testcontroller?mode=retake&testId=${selectedTestId}`);
  };

  const handleRevised = async () => {
    await fetch("/api/revised", { method: "POST", body: JSON.stringify({ testId: selectedTestId }), headers: { "Content-Type": "application/json" } });
    router.push(`/testcontroller?mode=revised&testId=${selectedTestId}`);
  };

  const totalTests = tests.length;

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

  const avgPercent = totalTests ? Math.round(tests.reduce((a, t) => a + (t.percent || 0), 0) / totalTests) : 0;
  const avgNumQuestions = totalTests ? Math.round(tests.reduce((a, t) => a + (t.questions?.length || 0), 0) / totalTests) : 0;

  const avgDifficultyLabel = (() => {
    const n = totalTests ? Math.round(tests.reduce((a, t) => a + Number(t.difficultyNumber || 1), 0) / totalTests) : 0;
    return n <= 3 ? "Beginner" : n <= 6 ? "Apprentice" : "Master";
  })();

  const mostUsedTopic = totalTests
    ? Object.entries(tests.reduce((acc, t) => {
        acc[t.topic || "Unknown"] = (acc[t.topic || "Unknown"] || 0) + 1;
        return acc;
      }, {}))
        .sort((a, b) => b[1] - a[1])[0][0]
    : "—";

  return (
    <>
      <RetakeModal open={retakeModalOpen} onClose={closeModal} onRetake={handleRetake} onRevised={handleRevised} />

      <div style={{ minHeight: "100vh", width: "100vw", background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)", display: "flex", justifyContent: "center", padding: "40px 20px", color: "white" }}>
        <div style={{ width: "92%", maxWidth: "980px", backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px)", borderRadius: "36px", border: "3px solid rgba(255,255,255,0.18)", padding: "40px" }}>

          <h1 style={{ textAlign: "center", marginBottom: "30px", color: darkGray }}>Your Progress</h1>

          <div style={{ display: "flex", gap: "20px", flexWrap: "nowrap", justifyContent: "center", marginBottom: "40px", overflowX: "auto" }}>
            <StatCard value={`${avgPercent}%`} subtitle="Average Score" />
            <StatCard value={avgNumQuestions} subtitle="Avg Number of Questions" />
            <StatCard value={avgDifficultyLabel} subtitle="Avg Difficulty" />
            <StatCard value={totalTests} subtitle="Total Tests" />
            <StatCard value={mostUsedTopic} subtitle="Most Common Topic" />
          </div>

          {bestTest && <h2 style={{ marginBottom: "20px", color: darkGray }}>Your Best Test Ever</h2>}
          {bestTest && (
            <TestCard
              test={bestTest}
              expanded={expandedIndex === -1}
              onExpandToggle={() => setExpandedIndex(expandedIndex === -1 ? null : -1)}
              onRetake={openRetakeModal}
              onDelete={handleDelete}
              isBest
            />
          )}

          <h2 style={{ marginBottom: "20px", color: darkGray }}>Your Saved Tests</h2>

          {tests.filter((t) => t !== bestTest).length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.8, color: darkGray }}>No saved tests yet.</p>
          ) : (
            tests
              .filter((t) => t !== bestTest)
              .map((t, index) => (
                <TestCard
                  key={t.id}
                  test={t}
                  expanded={expandedIndex === index}
                  onExpandToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
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
