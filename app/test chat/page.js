"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../global.css";

export default function Test() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter a test topic.");
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
          numQuestions,
        }),
      });

      const data = await res.json();
      localStorage.setItem("generatedTest", JSON.stringify(data.questions || []));
      router.push("/Testchat");
    } catch (err) {
      console.error("Error generating test:", err);
      alert("Something went wrong while generating your test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1>Generate Your Test</h1>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Enter test topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Difficulty: </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Number of Questions: </label>
        <input
          type="number"
          min="1"
          max="20"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          style={{
            padding: "8px",
            width: "60px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Start Test"}
      </button>
    </div>
  );
}
