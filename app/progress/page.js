"use client";

import { useState, useEffect } from "react";

export default function ProgressPage() {
  // Placeholder test data
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTests([]); // keep empty for now so grey UI shows
      setLoading(false);
    }, 800);
  }, []);

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
      {/* Main Frosted Container */}
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
              {tests.length === 0 ? "0%" : "??%"}
            </div>
            <p style={{ fontSize: "0.9rem" }}>Average Score</p>
          </div>

          {/* AVG QUESTIONS */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <h2 style={{ margin: 0 }}>
              {tests.length === 0 ? "0 / 0" : "?? / ??"}
            </h2>
            <p style={{ fontSize: "0.9rem" }}>Avg Number of Questions</p>
          </div>

          {/* AVG DIFFICULTY */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <h2 style={{ margin: 0 }}>{tests.length === 0 ? "0" : "??"}</h2>
            <p style={{ fontSize: "0.9rem" }}>Avg Difficulty</p>
          </div>

          {/* MOST USED TEST TYPE */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <h2 style={{ margin: 0 }}>{tests.length === 0 ? "—" : "??"}</h2>
            <p style={{ fontSize: "0.9rem" }}>Most Used Test Type</p>
          </div>

          {/* MOST USED TOPIC */}
          <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
            <h2 style={{ margin: 0 }}>{tests.length === 0 ? "—" : "??"}</h2>
            <p style={{ fontSize: "0.9rem" }}>Most Common Topic</p>
          </div>
        </div>

        {/* ===========================
            BEST TEST EVER
        ============================ */}
        <div
          style={{
            background:
              tests.length === 0
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "40px",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          <h2 style={{ marginBottom: "10px", fontWeight: 700 }}>
            Your Best Test Ever
          </h2>
          {tests.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No test data yet</p>
          ) : (
            <p>Best test info goes here</p>
          )}
        </div>

        {/* ===========================
            SAVED TESTS LIST
        ============================ */}
        <h2 style={{ marginBottom: "20px", fontWeight: 700 }}>
          Your Saved Tests
        </h2>

        {tests.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            No saved tests yet.
          </p>
        ) : (
          tests.map((test, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.18)",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "12px",
                border: "2px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
                color: "white",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontWeight: 700 }}>{test.topic}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>
                  Score: {test.score}% — {test.questions} questions
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  style={{
                    padding: "8px 12px",
                    background: "rgba(25,118,210,0.4)",
                    border: "2px solid rgba(255,255,255,0.25)",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ↺
                </button>

                <button
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.25)",
                    border: "2px solid rgba(255,255,255,0.25)",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  👁
                </button>

                <button
                  style={{
                    padding: "8px 12px",
                    background: "rgba(211,47,47,0.5)",
                    border: "2px solid rgba(255,255,255,0.25)",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
