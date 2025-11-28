// NEW app/progress/page.js REWRITE

"use client";

import { useState, useEffect } from "react";

function difficultyLabel(num) {
  const n = Number(num);  // force convert

  if (n >= 1 && n <= 3) return "Beginner";
  if (n >= 4 && n <= 6) return "Apprentice";
  if (n >= 7 && n <= 9) return "Master";
  return "Unknown"; // fallback for weird values
}

export default function ProgressPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedTests") || "[]");
      setTests(saved);
      setLoading(false);
    } catch (e) {
      console.error("Failed loading saved tests", e);
      setLoading(false);
    }
  }, []);

  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b) / arr.length : 0);

  // Compute stats
  const avgPercent = tests.length
    ? Math.round(avg(tests.map((t) => t.percent)))
    : 0;

  const avgNumQuestions = tests.length
    ? `${Math.round(avg(tests.map((t) => t.questions.length)))} / ${tests[0]?.questions.length || 0}`
    : "0 / 0";

  const avgDifficulty = tests.length
    ? Math.round(avg(tests.map((t) => t.difficulty || 1)))
    : 0;

  const mostUsedType = (() => {
    if (!tests.length) return "—";
    const counts = {};
    tests.forEach((t) => {
      counts[t.type] = (counts[t.type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  const mostUsedTopic = (() => {
    if (!tests.length) return "—";
    const counts = {};
    tests.forEach((t) => {
      counts[t.topic] = (counts[t.topic] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  const bestTest = tests.length
    ? tests.sort((a, b) => b.percent - a.percent)[0]
    : null;

  const handleDelete = (index) => {
    const newTests = tests.filter((_, i) => i !== index);
    setTests(newTests);
    localStorage.setItem("savedTests", JSON.stringify(newTests));
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
          maxWidth: "900px",
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

        {/* TOP FIVE STATS */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          {/* AVG PERCENT */}
          <StatCard label="Average Score" value={`${avgPercent}%`} gray={!tests.length} />

          {/* AVG NUMBER OF QUESTIONS */}
          <StatCard label="Avg Number of Questions" value={avgNumQuestions} gray={!tests.length} />

          {/* AVG DIFFICULTY */}
          <StatCard label="Avg Difficulty" value={difficultyLabel(avgDifficulty)} gray={!tests.length} />

          {/* MOST USED TYPE */}
          <StatCard label="Most Used Test Type" value={mostUsedType} gray={!tests.length} />

          {/* MOST USED TOPIC */}
          <StatCard label="Most Common Topic" value={mostUsedTopic} gray={!tests.length} />
        </div>

        {/* BEST TEST EVER */}
        <div
          style={{
            background: tests.length ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "40px",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          <h2 style={{ marginBottom: "10px", fontWeight: 700 }}>Your Best Test Ever</h2>
          {!tests.length ? (
            <p style={{ opacity: 0.8 }}>No test data yet</p>
          ) : (
            <p style={{ opacity: 0.95 }}>
              Topic: <b>{bestTest.topic}</b> — Score: <b>{bestTest.score}/{bestTest.total}</b> ({bestTest.percent}%)
            </p>
          )}
        </div>

        {/* SAVED TESTS LIST */}
        <h2 style={{ marginBottom: "20px", fontWeight: 700 }}>Your Saved Tests</h2>

        {!tests.length ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>No saved tests yet.</p>
        ) : (
          tests.map((test, index) => (
            <div
              key={index}
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
                    Score: {test.score}/{test.total} ({test.percent}%) — {test.questions.length} questions
                  </p>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    style={btnStyle}
                  >
                    👁
                  </button>

                  <button onClick={() => handleDelete(index)} style={deleteBtnStyle}>
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
                      <p>Explanation: {q.explanation}</p>
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

// COMPONENTS
function StatCard({ label, value, gray }) {
  const grayStyle = {
    background: "rgba(255,255,255,0.12)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
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
    minWidth: "160px",
    color: "white",
    boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
  };

  return (
    <div style={gray ? grayStyle : cardStyle}>
      <h2 style={{ margin: 0 }}>{value}</h2>
      <p style={{ fontSize: "0.9rem" }}>{label}</p>
    </div>
  );
}

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
