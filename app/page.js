"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [selectedTestTypes, setSelectedTestTypes] = useState([]);
  const [questionsPerType, setQuestionsPerType] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGenerateTest = async () => {
    if (!topic.trim() || selectedTestTypes.length === 0) {
      alert("Please enter a topic and select at least one test type!");
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
          selectedTestTypes,
          questionsPerType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API failed");

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

  const testTypes = ["multiple-choice", "multi-select", "true-false", "open-response", "short-answer"];

  {/* Total Questions Display (only if multiple types) */}
{selectedTestTypes.length > 1 && (
  <div
    style={{
      marginBottom: "26px",
      fontWeight: 700,
      color: "rgba(255,255,255,0.95)",
      fontSize: "1rem",
    }}
  >
    Total Questions:{" "}
    {selectedTestTypes.reduce(
      (total, type) => total + (questionsPerType[type] || 0),
      0
    )}
  </div>
)}

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
        <h2 style={{ marginBottom: "20px", fontWeight: 800, fontSize: "1.25rem" }}>Topic</h2>
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
          }}
        />

        {/* Difficulty Slider */}
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

        {/* Test Type Selector */}
        <div style={{ marginBottom: "18px", textAlign: "center" }}>
          <h3 style={{ margin: "8px 0", fontWeight: 700 }}>Select Test Types</h3>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {testTypes.map((type) => {
              const isSelected = selectedTestTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTestTypes(selectedTestTypes.filter((t) => t !== type));
                      const newQuestions = { ...questionsPerType };
                      delete newQuestions[type];
                      setQuestionsPerType(newQuestions);
                    } else {
                      setSelectedTestTypes([...selectedTestTypes, type]);
                      setQuestionsPerType({ ...questionsPerType, [type]: 5 });
                    }
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border: isSelected ? "3px solid #1976d2" : "2px solid rgba(255,255,255,0.3)",
                    backgroundColor: isSelected ? "rgba(25,118,210,0.14)" : "rgba(255,255,255,0.05)",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    minWidth: "130px",
                    textTransform: "capitalize",
                  }}
                >
                  {type.replace("-", " ")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions per Type Inputs */}
        {selectedTestTypes.length > 1 &&
          selectedTestTypes.map((type) => (
            <div key={type} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.95)",
                  marginBottom: "6px",
                }}
              >
                {type.replace("-", " ")} Questions
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={questionsPerType[type]}
                onChange={(e) =>
                  setQuestionsPerType({
                    ...questionsPerType,
                    [type]: Number(e.target.value),
                  })
                }
                style={{
                  width: "84px",
                  padding: "8px",
                  borderRadius: "10px",
                  border: "none",
                  textAlign: "center",
                  fontSize: "1rem",
                }}
              />
            </div>
          ))}

        {/* Single Number of Questions if only one type */}
        {selectedTestTypes.length === 1 && (
          <div style={{ marginBottom: "26px" }}>
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
              value={questionsPerType[selectedTestTypes[0]] || 5}
              onChange={(e) =>
                setQuestionsPerType({
                  ...questionsPerType,
                  [selectedTestTypes[0]]: Number(e.target.value),
                })
              }
              style={{
                width: "84px",
                padding: "8px",
                borderRadius: "10px",
                border: "none",
                textAlign: "center",
                fontSize: "1rem",
              }}
            />
          </div>
        )}

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
