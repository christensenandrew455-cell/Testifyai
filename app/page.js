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

  // New UI states
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [answerCounts, setAnswerCounts] = useState({
    multipleChoice: 4,
    multiSelect: 5,
  });
  const [typeQuestions, setTypeQuestions] = useState({}); // per-type question counts

  const testTypeList = [
    { key: "multipleChoice", label: "Multiple Choice" },
    { key: "multiSelect", label: "Multi Select" },
    { key: "shortAnswer", label: "Short Answer" },
    { key: "trueFalse", label: "True / False" },
    { key: "openResponse", label: "Open Response" },
  ];

  // Toggle type selection
  const toggleType = (key) => {
    setSelectedTypes((prev) => {
      const next = prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key];
      return next;
    });
  };

  // When selectedTypes changes and there are 2+ types, auto-fill typeQuestions evenly if empty
  useEffect(() => {
    if (selectedTypes.length <= 1) {
      // Clear per-type inputs when only one or zero selected (we'll use questionCount)
      setTypeQuestions({});
      return;
    }

    // If per-type not set, set defaults evenly
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
    } else {
      // if all present but sum is different than questionCount, we leave user values intact,
      // but we could optionally auto-adjust — keep it manual for now as you requested.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypes]);

  // Keep per-type totals in sync if questionCount changes and user hasn't manually set values:
  useEffect(() => {
    if (selectedTypes.length <= 1) return;
    // if all typeQuestions are zero or missing, refill evenly on total change
    const allMissingOrZero = selectedTypes.every((t) => !(t in typeQuestions) || Number(typeQuestions[t]) === 0);
    if (allMissingOrZero) {
      const base = Math.floor(questionCount / selectedTypes.length);
      const remainder = questionCount - base * selectedTypes.length;
      const next = {};
      selectedTypes.forEach((t, idx) => {
        next[t] = base + (idx === selectedTypes.length - 1 ? remainder : 0);
      });
      setTypeQuestions(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionCount]);

  const handleTypeQuestionChange = (key, value) => {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) return;
    setTypeQuestions((prev) => ({ ...prev, [key]: num }));
  };

  const handleAnswerCount = (key, value) => {
    setAnswerCounts((prev) => ({ ...prev, [key]: value }));
  };

  const distributedTotal = Object.values(typeQuestions).reduce((acc, v) => acc + (Number(v) || 0), 0);

  const handleGenerateTest = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    if (selectedTypes.length === 0) {
      alert("Please select at least one test type.");
      return;
    }

    // If multiple types selected, ensure the per-type total > 0
    if (selectedTypes.length > 1) {
      if (distributedTotal <= 0) {
        alert("Please assign at least one question across the selected test types.");
        return;
      }
    }

    setLoading(true);

    try {
      // construct payload
      const payload = {
        topic,
        difficulty,
        // When multiple types, send total derived from per-type sum; else send questionCount
        numQuestions: selectedTypes.length > 1 ? distributedTotal : Math.max(1, questionCount),
        types: selectedTypes,
        typeDistribution: selectedTypes.length > 1 ? typeQuestions : { [selectedTypes[0] || "default"]: Math.max(1, questionCount) },
        answerCounts, // include for generation logic later
      };

      const res = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      sessionStorage.setItem("testData", JSON.stringify(data.questions));
      sessionStorage.setItem("resumeIndex", "0");
      sessionStorage.setItem("testTypes", JSON.stringify(selectedTypes));
      sessionStorage.setItem("typeDistribution", JSON.stringify(payload.typeDistribution));

      router.push(`/test?topic=${encodeURIComponent(topic)}`);
    } catch (err) {
      console.error("❌ Error generating test:", err);
      alert("Failed to generate test. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // small helper for rendering button styles (keeps same look as original)
  const typeButtonStyle = (active) => ({
    padding: "10px 18px",
    borderRadius: "12px",
    border: active ? "3px solid rgba(255,255,255,0.95)" : "2px solid rgba(255,255,255,0.6)",
    backgroundColor: active ? "rgba(255,255,255,0.12)" : "transparent",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  });

  const smallPickerStyle = (active) => ({
    padding: "6px 10px",
    borderRadius: "10px",
    border: active ? "2px solid rgba(255,255,255,0.95)" : "1px solid rgba(255,255,255,0.6)",
    backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginRight: "8px",
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
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "40px",
          border: "3px solid rgba(255,255,255,0.2)",
          padding: "30px 40px",
          width: "92%",
          maxWidth: "700px",
          color: "white",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          marginTop: "20px",
        }}
      >
        <h2 style={{ marginBottom: "18px", fontWeight: 800 }}>Topic</h2>

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
            marginBottom: "18px",
            maxWidth: "100%",
          }}
        />

        {/* Difficulty */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            fontWeight: 600,
            maxWidth: "560px",
            marginLeft: "auto",
            marginRight: "auto",
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
            marginBottom: "18px",
            height: "6px",
            cursor: "pointer",
          }}
        />

        {/* Number of questions (Total) */}
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          Number of questions (Total)
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          style={{
            width: "100px",
            padding: "8px",
            borderRadius: "10px",
            border: "none",
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "18px",
          }}
        />

        {/* Test Type Section */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ fontWeight: 800, marginBottom: "10px" }}>Test Type</div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            {testTypeList.map((t) => {
              const active = selectedTypes.includes(t.key);
              return (
                <div key={t.key} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    onClick={() => toggleType(t.key)}
                    style={typeButtonStyle(active)}
                    aria-pressed={active}
                  >
                    {t.label}
                  </button>

                  {/* Conditional small pickers for MC and Multi Select */}
                  {active && t.key === "multipleChoice" && (
                    <div style={{ marginTop: "8px" }}>
                      {[3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => handleAnswerCount("multipleChoice", n)}
                          style={smallPickerStyle(answerCounts.multipleChoice === n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )}

                  {active && t.key === "multiSelect" && (
                    <div style={{ marginTop: "8px" }}>
                      {[4, 5, 6].map((n) => (
                        <button
                          key={n}
                          onClick={() => handleAnswerCount("multiSelect", n)}
                          style={smallPickerStyle(answerCounts.multiSelect === n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-type question boxes (show only if multiple types selected) */}
        {selectedTypes.length > 1 && (
          <div style={{ marginTop: "6px", marginBottom: "18px" }}>
            <div style={{ fontWeight: 800, marginBottom: "10px" }}>Questions per Test Type</div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              {selectedTypes.map((key) => {
                const label = testTypeList.find((t) => t.key === key)?.label ?? key;
                return (
                  <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, marginBottom: "6px" }}>{label}</div>
                    <input
                      type="number"
                      min="0"
                      value={typeQuestions[key] ?? ""}
                      onChange={(e) => handleTypeQuestionChange(key, e.target.value)}
                      style={{
                        width: "90px",
                        padding: "8px",
                        borderRadius: "10px",
                        border: "none",
                        textAlign: "center",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "12px", fontWeight: 700 }}>
              Total: <span style={{ color: "white", opacity: 0.95 }}>{distributedTotal}</span>
            </div>
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
            marginTop: "6px",
          }}
        >
          {loading ? "Generating..." : "Generate Test"}
        </button>
      </div>

      {/* --- Learn More Button Below Card --- */}
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
            transition: "background 0.2s",
          }}
        >
          Learn More
        </Link>
      </div>

      {/* --- Logo in corner --- */}
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
