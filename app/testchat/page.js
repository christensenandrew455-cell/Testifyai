"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestSetupPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleGenerateTest = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          numQuestions: Math.max(1, questionCount),
        }),
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      // Save generated questions for testchat to read
      sessionStorage.setItem("testdata", JSON.stringify(data.questions));

      // 🟢 Initialize score tracking (invisible)
      sessionStorage.setItem("score", "0");

      // Start at the beginning
      sessionStorage.setItem("resumeIndex", "0");

      router.push(`/testchat?topic=${encodeURIComponent(topic)}`);
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
        <h2 style={{ marginBottom: "24px", fontWeight: 800 }}>Topic</h2>
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
            marginBottom: "28px",
            height: "6px",
            cursor: "pointer",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
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
            width: "80px",
            padding: "8px",
            borderRadius: "10px",
            border: "none",
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "32px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => router.push("/")}
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
              transition: "background-color 0.2s",
              width: "140px",
            }}
          >
            Back
          </button>

          <button
            onClick={handleGenerateTest}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: "12px",
              border: "none",
              backgroundColor: loading ? "#ccc" : "#1976d2",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              width: "140px",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Generating..." : "Generate Test"}
          </button>
        </div>
      </div>

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
