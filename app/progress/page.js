"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllTests } from "../lib/firestore";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { RotateCw, Eye, Trash2 } from "lucide-react";   // <-- ADDED

export default function ProgressPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [retakeModalOpen, setRetakeModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);

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
      } catch (e) {
        console.error("fallbackLoadLocal error:", e);
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
    ? Math.round(
        tests.reduce((acc, t) => acc + (Number(t.percent) || 0), 0) / totalTests
      )
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
      const res = await fetch("/api/retake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: selectedTestId }),
      });
      if (!res.ok) console.error("retake API error");
    } catch (err) {
      console.error("retake error:", err);
    } finally {
      closeModal();
      router.push(`/testcontroller?mode=retake&testId=${encodeURIComponent(selectedTestId)}`);
    }
  };

  const handleRevised = async () => {
    if (!selectedTestId) return;
    try {
      const res = await fetch("/api/revised", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: selectedTestId }),
      });
      if (!res.ok) console.error("revised API error");
    } catch (err) {
      console.error("revised error:", err);
    } finally {
      closeModal();
      router.push(`/testcontroller?mode=revised&testId=${encodeURIComponent(selectedTestId)}`);
    }
  };

  const cardTextColor = "#666";

  return (
    <>
      {/* Modal ... unchanged */}

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
          {/* … all other sections unchanged … */}

          {/* Saved Tests */}
          <h2 style={{ marginBottom: "20px", fontWeight: 700, color: "white" }}>
            Your Saved Tests
          </h2>

          {tests.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.8, color: "white" }}>
              No saved tests yet.
            </p>
          ) : (
            tests.map((test, index) => (
              <div
                key={test.id || index}
                style={{
                  background: "white",
                  color: cardTextColor,
                  borderRadius: "12px",
                  padding: "15px",
                  marginBottom: "18px",
                  border: "2px solid rgba(0,0,0,0.06)",
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
                    <h3 style={{ margin: 0, fontWeight: 700, color: cardTextColor }}>
                      {test.topic}
                    </h3>
                    <p style={{ margin: 0, color: cardTextColor }}>
                      Score: {test.score}/{test.total} ({test.percent}%) —{" "}
                      {(test.questions || []).length} questions — Difficulty:{" "}
                      {difficultyLabel(test.difficultyNumber)}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => openRetakeModal(test.id)}
                      style={restartBtnStyle}
                      aria-label="Retake / Revised"
                      title="Retake / Revised"
                    >
                      <RotateCw size={18} color="black" />
                    </button>

                    <button
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                      style={viewBtnStyle}
                      aria-label="View test"
                      title="View"
                    >
                      <Eye size={18} color="black" />
                    </button>

                    <button
                      onClick={() => handleDelete(test.id, index)}
                      style={deleteBtnStyle}
                      aria-label="Delete test"
                      title="Delete"
                    >
                      <Trash2 size={18} color="black" />
                    </button>
                  </div>
                </div>

                {expandedIndex === index && (
                  <div style={{ marginTop: "14px", paddingLeft: "10px" }}>
                    {(test.questions || []).map((q, i) => (
                      <div
                        key={i}
                        style={{ marginBottom: "12px", color: cardTextColor }}
                      >
                        <p style={{ color: cardTextColor }}>
                          <b>Q{i + 1}:</b> {q.question}
                        </p>
                        <p style={{ color: cardTextColor }}>
                          User Answer: {q.userAnswer}
                        </p>
                        <p style={{ color: cardTextColor }}>
                          Correct Answer: {q.correctAnswer}
                        </p>
                        {q.explanation && (
                          <p style={{ color: cardTextColor }}>
                            Explanation: {q.explanation}
                          </p>
                        )}
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
    </>
  );
}
