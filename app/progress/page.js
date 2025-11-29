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
          (acc, t) =>
            acc + (Array.isArray(t.questions) ? t.questions.length : 0),
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
    const confirmDelete = confirm(
      "Delete this saved test? This cannot be undone."
    );
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
      await fetch("/api/retake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: selectedTestId }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      closeModal();
      router.push(
        `/testcontroller?mode=retake&testId=${encodeURIComponent(
          selectedTestId
        )}`
      );
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
      router.push(
        `/testcontroller?mode=revised&testId=${encodeURIComponent(
          selectedTestId
        )}`
      );
    }
  };

  return (
    <>
      {/* FIX FOR GLOBAL STYLES OVERRIDING COLORS */}
      <style>
        {`
          .progress-reset, .progress-reset * {
            all: unset;
            display: revert;
            box-sizing: border-box;
          }
        `}
      </style>

      {retakeModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              width: "90%",
              maxWidth: "420px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "700" }}>
              Select Test Mode
            </h3>
            <p style={{ margin: "10px 0 20px" }}>
              Choose how you want to take this test.
            </p>

            <button
              onClick={handleRetake}
              style={{
                padding: "10px",
                width: "100%",
                marginBottom: "12px",
                background: "#1976d2",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Retake Test
            </button>

            <button
              onClick={handleRevised}
              style={{
                padding: "10px",
                width: "100%",
                marginBottom: "12px",
                background: "#9c27b0",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Revised Test
            </button>

            <button
              onClick={closeModal}
              style={{
                padding: "10px",
                width: "100%",
                background: "#d32f2f",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="progress-reset" style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
          Test Progress
        </h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && tests.length === 0 && (
          <p>No saved tests yet. Take a test to see your progress!</p>
        )}

        {tests.length > 0 && (
          <>
            <div
              style={{
                marginBottom: "20px",
                padding: "20px",
                background: "white",
                borderRadius: "10px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ marginBottom: "12px" }}>Summary</h2>

              <p>Total Tests: {totalTests}</p>
              <p>Average Score: {avgPercent}%</p>
              <p>Average Number of Questions: {avgNumQuestions}</p>
              <p>Average Difficulty: {avgDifficultyLabel}</p>
              <p>Most Used Type: {mostUsedType}</p>
              <p>Most Used Topic: {mostUsedTopic}</p>

              {bestTest && (
                <p style={{ marginTop: "10px", fontWeight: 700 }}>
                  Best Test: {bestTest.topic} ({bestTest.percent}%)
                </p>
              )}
            </div>

            {tests.map((test, i) => (
              <div
                key={test.id}
                style={{
                  background: "white",
                  padding: "16px",
                  marginBottom: "12px",
                  borderRadius: "10px",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ marginBottom: "8px" }}>
                  {test.topic} — {test.percent}%
                </h3>

                <button
                  style={{ ...viewBtnStyle, marginRight: "8px" }}
                  onClick={() =>
                    setExpandedIndex(expandedIndex === i ? null : i)
                  }
                >
                  {expandedIndex === i ? "Hide Details" : "View Details"}
                </button>

                <button
                  style={{ ...restartBtnStyle, marginRight: "8px" }}
                  onClick={() => openRetakeModal(test.id)}
                >
                  Start
                </button>

                <button
                  style={deleteBtnStyle}
                  onClick={() => handleDelete(test.id, i)}
                >
                  Delete
                </button>

                {expandedIndex === i && (
                  <div style={{ marginTop: "12px" }}>
                    <p>
                      <strong>Topic:</strong> {test.topic}
                    </p>
                    <p>
                      <strong>Type:</strong> {test.type}
                    </p>
                    <p>
                      <strong>Questions:</strong>{" "}
                      {Array.isArray(test.questions)
                        ? test.questions.length
                        : 0}
                    </p>
                    <p>
                      <strong>Difficulty:</strong>{" "}
                      {difficultyLabel(test.difficultyNumber)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
