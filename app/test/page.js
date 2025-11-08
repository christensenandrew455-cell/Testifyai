"use client";
import { useEffect, useState } from "react";
import MultipleChoice from "@/multiple-choice";

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) setQuestions(JSON.parse(stored));
  }, []);

  const current = questions[currentIndex];

  if (!current) {
    return (
      <div style={{ textAlign: "center", marginTop: "40vh" }}>
        Loading test...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <h2 style={{ color: "#1976d2", fontWeight: 800 }}>
        {current.question}
      </h2>

      <MultipleChoice question={current} />

      <button
        onClick={() => setCurrentIndex((i) => i + 1)}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontWeight: 700,
        }}
      >
        Next
      </button>
    </div>
  );
}
