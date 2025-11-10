"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [questionCount, setQuestionCount] = useState(5);
  const [testType, setTestType] = useState("multiple-choice"); // default
  const [loading, setLoading] = useState(false);

  const handleGenerateTest = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          numQuestions: Math.max(1, questionCount),
          testType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API failed");

      // store final structured test
      sessionStorage.setItem("testData", JSON.stringify(data));
      sessionStorage.setItem("resumeIndex", "0");

      router.push(`/test?topic=${encodeURIComponent(topic)}`);
    } catch (err) {
      console.error("❌ Error generating test:", err);
      alert("Failed to generate test. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        color: "white",
        textAlign: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      {/* Logo in corner */}
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

      {/* --- Header Section --- */}
      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 3.25rem)",
          fontWeight: 800,
          textShadow: "0 2px 6px rgba(0,0,0,0.25)",
          marginBottom: "0.5rem",
        }}
      >
        Welcome to TheTestifyAI
      </h1>

      <p
        style={{
          fontSize: "1.125rem",
          maxWidth: "720px",
          marginBottom: "2rem",
          color: "rgba(255,255,255,0.95)",
          lineHeight: 1.5,
        }}
      >
        Instantly generate an AI-powered test on any topic — free, fast, and fun.
      </p>

      {/* --- Test Setup Card --- */}
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          borderRadius: "40px",
          border: "3px solid rgba(255,255,255,0.18)",
          padding: "36px 44px",
          width: "92%",
          maxWidth: "520px",
          color: "white",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          marginTop: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: 800, fontSize: "1.25rem" }}>
          Topic
        </h2>

        <input
          type="text"
          placeholder="Enter any topic — broad or specific"
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
            marginBottom: "26px",
            maxWidth: "100%",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          <span>Beginner</span>
          <span>Difficulty Scale</span>
          <span>Master</span>
        </div>

        <input
          type="range"
          min="1"
          max="9"
          step="1"
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#1976d2",
            marginBottom: "22px",
            height: "6px",
            cursor: "pointer",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.95)",
          }}
        >
          Number of questions
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          style={{
            width: "84px",
            padding: "8px",
            borderRadius: "10px",
            border: "none",
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "26px",
          }}
        />

        {/* --- Test Type selector (visual) --- */}
        <div style={{ marginBottom: "18px", textAlign: "left" }}>
          <h3 style={{ margin: "8px 0", fontWeight: 700 }}>Test Type</h3>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Multiple Choice - active */}
            <button
              onClick={() => setTestType("multiple-choice")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "8px",
                borderRadius: "14px",
                border:
                  testType === "multiple-choice"
                    ? "3px solid #1976d2"
                    : "2px solid rgba(255,255,255,0.12)",
                backgroundColor:
                  testType === "multiple-choice"
                    ? "rgba(25,118,210,0.14)"
                    : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                width: "150px",
              }}
            >
              {/* Replace src with your actual image path */}
              <img
                src="/images/multiple-choice.png"
                alt="Multiple choice"
                style={{ width: "100%", height: "88px", objectFit: "cover", borderRadius: 10 }}
              />
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Multiple Choice</div>
            </button>

            {/* Placeholder for other test types (disabled/greyed) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "8px",
                borderRadius: "14px",
                border: "2px dashed rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.02)",
                width: "150px",
                opacity: 0.45,
              }}
            >
              <img
                src="/images/placeholder.png"
                alt="Other"
                style={{ width: "100%", height: "88px", objectFit: "cover", borderRadius: 10 }}
              />
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Other Types (Soon)</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateTest}
          disabled={loading}
          style={{
            padding: "12px 0",
            borderRadius: "12px",
            border: "none",
            backgroundColor: loading ? "#ccc" : "#1976d2",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            transition: "background-color 0.2s",
          }}
        >
          {loading ? "Generating..." : "Generate Test"}
        </button>
      </div>

      {/* --- Learn More Button Below Card --- */}
      <div style={{ marginTop: "26px" }}>
        <Link
          href="/learn"
          style={{
            backgroundColor: "rgba(255,255,255,0.12)",
            padding: "10px 24px",
            borderRadius: "12px",
            color: "white",
            fontWeight: 600,
            textDecoration: "none",
            border: "2px solid rgba(255,255,255,0.18)",
            transition: "background 0.2s",
          }}
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}

