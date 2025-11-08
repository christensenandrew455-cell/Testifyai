"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OpenResponseTest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Unknown Topic";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      setQuestions(JSON.parse(stored));
    }
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleCheckAnswer = () => {
    if (!currentQuestion || !answer.trim()) return;

    // Store user answer
    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        if (data[currentIndex]) {
          data[currentIndex].userAnswer = answer.trim();
          // For now, we don't check correctness — leave for backend or manual later
          data[currentIndex].isCorrect = null;
        }
        sessionStorage.setItem("testData", JSON.stringify(data));
      }
      sessionStorage.setItem("topic", topic);
    } catch (err) {
      console.error("Error saving answer:", err);
    }

    const query = new URLSearchParams({
      question: currentQuestion.question,
      userAnswer: answer.trim(),
      correctAnswer: currentQuestion.correct || "",
      explanation: currentQuestion.explanation || "",
      index: currentIndex.toString(),
      topic,
    }).toString();

    // Just route like other pages
    router.push(`/incorrect?${query}`);
  };

  if (!currentQuestion) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          color: "#333",
        }}
      >
        Loading question...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        color: "#222",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "800px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "8px 20px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Leave
        </button>

        <h2
          style={{
            fontWeight: 800,
            fontSize: "1.3rem",
            color: "#1976d2",
          }}
        >
          {topic}
        </h2>

        <div style={{ fontWeight: 700, color: "#1976d2" }}>TheTestifyAI</div>
      </div>

      <div
        style={{
          border: "3px solid #1976d2",
          borderRadius: "16px",
          backgroundColor: "white",
          width: "100%",
          maxWidth: "700px",
          padding: "24px",
          fontSize: "1.1rem",
          fontWeight: 500,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
      >
        {currentQuestion.question}
      </div>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "2px solid #1976d2",
          fontSize: "1rem",
          marginBottom: "24px",
        }}
      />

      <button
        onClick={handleCheckAnswer}
        style={{
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "10px 20px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Check Answer
      </button>

      <div style={{ marginTop: "20px", fontWeight: 600 }}>
        Question {currentIndex + 1} of {questions.length}
      </div>
    </div>
  );
}
