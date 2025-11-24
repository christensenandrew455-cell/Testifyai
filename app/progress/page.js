"use client";

import { useState, useEffect } from "react";

export default function ProgressPage() {
  // Placeholder test data (will be replaced with Firestore later)
  const [tests, setTests] = useState([]); // empty means grey UI
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with Firestore fetch
    setTimeout(() => {
      setTests([]); // keep empty for now so you see grey state
      setLoading(false);
    }, 800);
  }, []);

  const grayCardStyle = {
    background: "#e5e5e5",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    flex: 1,
    minWidth: "160px",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    flex: 1,
    minWidth: "160px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Your Progress</h1>

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
              border: "6px solid #ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem",
              color: "#555",
            }}
          >
            {tests.length === 0 ? "0%" : "??%" /* replace later */}
          </div>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>Average Score</p>
        </div>

        {/* AVG QUESTIONS */}
        <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
          <h2 style={{ margin: "0", color: "#555" }}>
            {tests.length === 0 ? "0 / 0" : "?? / ??"}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Avg Number of Questions
          </p>
        </div>

        {/* AVG DIFFICULTY */}
        <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
          <h2 style={{ margin: "0", color: "#555" }}>
            {tests.length === 0 ? "0" : "??"}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Avg Difficulty
          </p>
        </div>

        {/* MOST USED TEST TYPE */}
        <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
          <h2 style={{ margin: "0", color: "#555" }}>
            {tests.length === 0 ? "—" : "??"}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Most Used Test Type
          </p>
        </div>

        {/* MOST USED TOPIC */}
        <div style={tests.length === 0 ? grayCardStyle : cardStyle}>
          <h2 style={{ margin: "0", color: "#555" }}>
            {tests.length === 0 ? "—" : "??"}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Most Common Topic
          </p>
        </div>
      </div>

      {/* ===========================
          BEST TEST EVER
      ============================ */}
      <div
        style={{
          background: tests.length === 0 ? "#e5e5e5" : "white",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "40px",
          boxShadow:
            tests.length === 0 ? "none" : "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Your Best Test Ever</h2>
        {tests.length === 0 ? (
          <p style={{ color: "#666" }}>No test data yet</p>
        ) : (
          <p>Best test info will go here</p>
        )}
      </div>

      {/* ===========================
          SAVED TESTS LIST
      ============================ */}
      <h2 style={{ marginBottom: "20px" }}>Your Saved Tests</h2>

      {tests.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No saved tests yet.</p>
      ) : (
        tests.map((test, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "12px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Test info */}
            <div>
              <h3 style={{ margin: 0 }}>{test.topic}</h3>
              <p style={{ margin: 0, color: "#666" }}>
                Score: {test.score}% — {test.questions} questions
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              {/* Restart */}
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  background: "#1976d2",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ↺
              </button>

              {/* View */}
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  background: "#555",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                👁
              </button>

              {/* Delete */}
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  background: "#d32f2f",
                  color: "white",
                  borderRadius: "6px",
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
  );
}
