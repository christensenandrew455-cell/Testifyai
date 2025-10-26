"use client";
import { useState } from "react";
import Link from "next/link";

export default function TestSetupPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [questionCount, setQuestionCount] = useState(5);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "40px",
          border: "3px solid rgba(255,255,255,0.2)",
          padding: "40px 50px",
          width: "90%",
          maxWidth: "450px",
          color: "white",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <h2 style={{ marginBottom: "24px", fontWeight: 800 }}>Topic</h2>

        {/* Topic input */}
        <input
          type="text"
          placeholder="What do you want to be tested on?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            fontSize: "1rem",
            textAlign: "center",
            outline: "none",
            marginBottom: "28px",
          }}
        />

        {/* Difficulty label */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          <span>Beginner</span>
          <span>Difficulty Scale</span>
          <span>Master</span>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            width: "100%",
            accentColor: "#1976d2", // ✅ blue slider
            marginBottom: "28px",
            height: "6px",
            cursor: "pointer",
          }}
        />

        {/* Number of questions */}
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          Number of questions on the test
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          style={{
            width: "80px",
            padding: "8px",
            borderRadius: "10px",
            border: "none",
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "32px",
          }}
        />

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <button
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#1976d2",
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.2s, transform 0.1s",
                width: "140px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#135cb0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976d2")
              }
            >
              Back
            </button>
          </Link>

          <button
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.1s",
              width: "140px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#135cb0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1976d2")
            }
            onClick={() => {
              alert(
                `Generating a test on "${topic}" with difficulty ${difficulty} and ${questionCount} questions.`
              );
            }}
          >
            Generate Test
          </button>
        </div>
      </div>

      {/* Logo text */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          fontWeight: 700,
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        TheTestifyAI
      </div>
    </div>
  );
}
