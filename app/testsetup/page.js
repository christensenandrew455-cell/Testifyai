"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestSetupPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [loading, setLoading] = useState(false);
  const [adShown, setAdShown] = useState(false);

  const testTypeOptions = [
    "multiple-choice",
    "multi-select",
    "true-false",
    "open-response",
    "short-answer",
  ];

  const handleToggleType = (type) => {
    setSelectedTypes((prev) => {
      if (prev[type]) {
        const updated = { ...prev };
        delete updated[type];
        return updated;
      } else {
        return { ...prev, [type]: 5 };
      }
    });
  };

  const handleQuestionCountChange = (type, value) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: Math.max(1, value) }));
  };

  const handleGenerateTest = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }
    if (Object.keys(selectedTypes).length === 0) {
      alert("Please select at least one test type!");
      return;
    }

    if (!adShown) {
      try {
        const script = document.createElement("script");
        script.dataset.zone = "10137448";
        script.src = "https://groleegni.net/vignette.min.js";
        document.body.appendChild(script);
        setAdShown(true);
      } catch (err) {
        console.error("Ad script failed:", err);
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/distribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          questionsPerType: selectedTypes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.questions) throw new Error(data.error || "API failed");

      sessionStorage.setItem("testData", JSON.stringify(data));
      sessionStorage.setItem("resumeIndex", "0");

      router.push(
        `/test/controller?data=${encodeURIComponent(JSON.stringify(data))}`
      );
    } catch (err) {
      console.error("❌ Error generating test:", err);
      alert("Failed to generate test. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalQuestions = Object.values(selectedTypes).reduce(
    (a, b) => a + b,
    0
  );

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

      {/* Test Setup Card */}
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
        <h2 style={{ marginBottom: "6px", fontWeight: 800, fontSize: "1.25rem" }}>
          Topic
        </h2>

        <p style={{ marginBottom: "18px", opacity: 0.9 }}>
          Enter any topic — broad or specific
        </p>

        <input
          type="text"
          placeholder="e.g., Math, Algebra"
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

        <h3 style={{ margin: "8px 0", fontWeight: 700 }}>Test Types</h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {testTypeOptions.map((type) => (
            <div
              key={type}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <button
                onClick={() => handleToggleType(type)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "12px",
                  border: selectedTypes[type]
                    ? "3px solid #1976d2"
                    : "2px solid rgba(255,255,255,0.3)",
                  backgroundColor: selectedTypes[type]
                    ? "rgba(25,118,210,0.14)"
                    : "rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  fontWeight: 600,
                  width: "160px",
                  color: "white",
                }}
              >
                {type.replace("-", " ").toUpperCase()}
              </button>

              {selectedTypes[type] && (
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={selectedTypes[type]}
                  onChange={(e) =>
                    handleQuestionCountChange(type, Number(e.target.value))
                  }
                  style={{
                    width: "60px",
                    padding: "6px",
                    borderRadius: "8px",
                    border: "none",
                    textAlign: "center",
                    fontSize: "0.95rem",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {Object.keys(selectedTypes).length > 1 && (
          <div style={{ marginTop: "12px", fontWeight: 600 }}>
            Total Questions: {totalQuestions}
          </div>
        )}

        {/* BACK + GENERATE BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.35)",
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              backdropFilter: "blur(6px)",
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
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
