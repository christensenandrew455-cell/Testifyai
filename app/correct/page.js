"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CorrectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const question = searchParams.get("question");
  const userAnswer = searchParams.get("userAnswer");
  const correctAnswer = searchParams.get("correctAnswer");
  const explanation = searchParams.get("explanation");
  const index = parseInt(searchParams.get("index") || "0");

  const handleClick = () => {
    sessionStorage.setItem("resumeIndex", index + 1);
    router.push("/testchat");
  };

  return (
    <div
      onClick={handleClick}
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#4CAF50",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "5rem", marginBottom: "20px" }}>✅</div>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "20px" }}>
        Correct!
      </h1>

      <p style={{ maxWidth: "600px", marginBottom: "10px" }}>
        <strong>Question:</strong> {question}
      </p>
      <p>
        <strong>Your Answer:</strong> {userAnswer}
      </p>
      <p>
        <strong>Correct Answer:</strong> {correctAnswer}
      </p>

      {explanation && (
        <p
          style={{
            fontSize: "1.1rem",
            marginTop: "20px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
          }}
        >
          💡 {explanation}
        </p>
      )}

      <div
        style={{
          fontSize: "1rem",
          opacity: 0.9,
          fontWeight: 500,
          borderTop: "1px solid rgba(255,255,255,0.3)",
          paddingTop: "10px",
          marginTop: "30px",
        }}
      >
        Click to continue
      </div>
    </div>
  );
}

export default function CorrectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CorrectPageContent />
    </Suspense>
  );
}
