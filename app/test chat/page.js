"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../global.css";

export default function Testchat() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("generatedTest");
    if (saved) {
      setQuestions(JSON.parse(saved));
    }
  }, []);

  if (!questions.length) {
    return (
      <div
        style={{
          textAlign: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>No test found. Please generate one first.</p>
        <button onClick={() => router.push("/Test")}>Go Back</button>
      </div>
    );
  }

  const current = questions[currentIndex];

  const handleNext = () => {
    if (selected === current.correct) {
      setScore(score + 1);
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    } else {
      const percentage = Math.round((score / questions.length) * 100);
      localStorage.setItem(
        "testResults",
        JSON.stringify({
          topic: "Custom Test",
          score: percentage,
          level: "N/A",
          time: "N/A",
        })
      );
      router.push("/Results");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h2>
        Question {currentIndex + 1} of {questions.length}
      </h2>
      <p style={{ maxWidth: "600px", marginBottom: "20px" }}>{current.question}</p>

      <div>
        {current.answers.map((a, i) => (
          <button
            key={i}
            onClick={() => setSelected(a)}
            style={{
              backgroundColor:
                selected === a ? "#2563eb" : "#3b82f6",
              margin: "5px",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {a}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleNext} disabled={!selected}>
          {currentIndex < questions.length - 1 ? "Next Question" : "Finish Test"}
        </button>
      </div>
    </div>
  );
}
