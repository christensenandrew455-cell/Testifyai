"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [answerCounts, setAnswerCounts] = useState({
    "multiple-choice": 4,
    "multi-select": 5,
  });
  const [typeQuestions, setTypeQuestions] = useState({});

  const testTypeList = [
    { key: "multiple-choice", label: "Multiple Choice" },
    { key: "multi-select", label: "Multi Select" },
    { key: "short-answer", label: "Short Answer" },
    { key: "true-false", label: "True / False" },
    { key: "open-response", label: "Open Response" },
  ];

  const toggleType = (key) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    if (selectedTypes.length <= 1) {
      setTypeQuestions({});
      return;
    }

    const missing = selectedTypes.filter((t) => !(t in typeQuestions));
    if (missing.length > 0) {
      const base = Math.floor(questionCount / selectedTypes.length);
      const remainder = questionCount - base * selectedTypes.length;
      const next = { ...typeQuestions };

      selectedTypes.forEach((t, idx) => {
        if (!(t in next)) {
          next[t] = base + (idx === selectedTypes.length - 1 ? remainder : 0);
        }
      });
      setTypeQuestions(next);
    }
  }, [selectedTypes, questionCount, typeQuestions]);

  const handleTypeQuestionChange = (key, value) => {
    const num = Number(value);
    if (!Number.isNaN(num) && num >= 0) {
      setTypeQuestions((prev) => ({ ...prev, [key]: num }));
    }
  };

  const handleAnswerCount = (key, value) => {
    setAnswerCounts((prev) => ({ ...prev, [key]: value }));
  };

  const distributedTotal = Object.values(typeQuestions).reduce(
    (acc, v) => acc + (Number(v) || 0),
    0
  );

  const handleGenerateTest = async () => {
    console.log("🧠 Starting test generation...");

    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    if (selectedTypes.length === 0) {
      alert("Please select at least one test type.");
      return;
    }

    setLoading(true);

    const payload = {
      topic,
      difficulty,
      numQuestions:
        selectedTypes.length > 1 ? distributedTotal : questionCount,
      selectedTypes,
      typeDistribution:
        selectedTypes.length > 1
          ? typeQuestions
          : { [selectedTypes[0] || "multiple-choice"]: questionCount },
      answerCounts,
    };

    console.log("📦 Payload being sent to API:", payload);

    try {
      const res = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📬 API response:", res.status);

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ API response data:", data);

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid questions data from API");
      }

      sessionStorage.setItem("testData", JSON.stringify(data.questions));
      sessionStorage.setItem("resumeIndex", "0");
      sessionStorage.setItem("testTypes", JSON.stringify(selectedTypes));
      sessionStorage.setItem(
        "typeDistribution",
        JSON.stringify(payload.typeDistribution)
      );

      console.log("🚀 Navigating to /test...");
      router.push(`/test?topic=${encodeURIComponent(topic)}`);
    } catch (err) {
      console.error("❌ Error generating test:", err);
      alert("Failed to generate test. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const typeButtonStyle = (active) => ({
    padding: "10px 18px",
    borderRadius: "12px",
    border: active
      ? "3px solid rgba(255,255,255,0.95)"
      : "2px solid rgba(255,255,255,0.6)",
    backgroundColor: active ? "#1976d2" : "transparent",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    transition: "all 0.2s ease",
  });

  const smallPickerStyle = (active) => ({
    padding: "6px 10px",
    borderRadius: "10px",
    border: active
      ? "2px solid rgba(255,255,255,0.95)"
      : "1px solid rgba(255,255,255,0.6)",
    backgroundColor: active ? "#2196f3" : "transparent",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginRight: "8px",
    transition: "all 0.2s ease",
  });

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
      }}
    >
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

      {/* Type selection buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {testTypeList.map((t) => {
          const active = selectedTypes.includes(t.key);
          return (
            <button
              key={t.key}
              onClick={() => toggleType(t.key)}
              style={typeButtonStyle(active)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleGenerateTest}
        disabled={loading}
        style={{
          padding: "12px 28px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: loading ? "#ccc" : "#1976d2",
          color: "white",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {loading ? "Generating..." : "Generate Test"}
      </button>

      <div style={{ marginTop: "30px" }}>
        <Link
          href="/learn"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            padding: "12px 28px",
            borderRadius: "12px",
            color: "white",
            fontWeight: 600,
            textDecoration: "none",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}

