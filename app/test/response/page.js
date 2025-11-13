"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Response({ question, topic, difficulty, currentIndex, totalQuestions }) {
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  const handleCheck = async () => {
    if (!answer.trim()) return alert("Please enter an answer first!");

    // Navigate to grading screen, passing everything through query params
    const payload = {
      question: question.question,
      topic,
      difficulty,
      answer
    };

    router.push(`/test/grading?data=${encodeURIComponent(JSON.stringify(payload))}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#f8fafc",
      padding: "40px 20px",
      fontFamily: "Segoe UI, Roboto, sans-serif",
      color: "#222"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: "800px",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        borderBottom: "2px solid #1976d2",
        paddingBottom: "10px"
      }}>
        <button onClick={() => router.push("/")}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "6px 16px",
            fontWeight: 600,
            cursor: "pointer"
          }}>
          Leave
        </button>
        <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{topic}</div>
        <div style={{ fontWeight: 700, color: "#1976d2" }}>TheTestifyAI</div>
      </div>

      {/* Question */}
      <div style={{
        border: "3px solid #1976d2",
        borderRadius: "16px",
        backgroundColor: "white",
        width: "100%",
        maxWidth: "700px",
        padding: "24px",
        fontSize: "1.1rem",
        fontWeight: 500,
        textAlign: "center",
        marginBottom: "24px"
      }}>
        {question.question}
      </div>

      {/* Answer Box */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "120px",
          border: "2px solid rgba(0,0,0,0.1)",
          borderRadius: "12px",
          padding: "10px",
          fontSize: "1rem",
          fontFamily: "inherit",
          marginBottom: "24px"
        }}
      />

      {/* Footer */}
      <div style={{
        width: "100%",
        maxWidth: "700px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ fontWeight: 600 }}>
          Question {currentIndex + 1} of {totalQuestions}
        </div>
        <button
          onClick={handleCheck}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: 700,
            cursor: "pointer"
          }}>
          Check
        </button>
      </div>
    </div>
  );
}
