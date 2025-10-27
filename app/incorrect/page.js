"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function IncorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const question = searchParams.get("question") || "";
  const userAnswer = searchParams.get("userAnswer") || "";
  const correctAnswer = searchParams.get("correctAnswer") || "";
  const explanation = searchParams.get("explanation") || "";
  const index = Number(searchParams.get("index") ?? 0);
  const topic = searchParams.get("topic") || "";

  const [questions, setQuestions] = useState([]);
  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) setQuestions(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to read testData:", e);
      setQuestions([]);
    }

    const t = setTimeout(() => setCanClick(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const isLast = questions.length > 0 ? index >= questions.length - 1 : false;

  const handleContinue = () => {
    if (!canClick) return;
    if (isLast) {
      router.push("/ad");
    } else {
      sessionStorage.setItem("resumeIndex", String(index + 1));
      router.push(`/testchat?topic=${encodeURIComponent(topic)}`);
    }
  };

  return (
    <div
      onClick={handleContinue}
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #ff8a80, #e53935)",
        color: "white",
        textAlign: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        padding: "20px",
        cursor: canClick ? "pointer" : "default",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 12 }}>❌</div>
      <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 800 }}>Incorrect</h1>

      <div style={{ maxWidth: 760, marginBottom: 10 }}>
        <p style={{ margin: "8px 0" }}>
          <strong>Question:</strong> {question}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Your answer:</strong> {userAnswer}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Correct answer:</strong> {correctAnswer}
        </p>
      </div>

      {explanation && (
        <p style={{ maxWidth: 760, marginTop: 12, opacity: 0.95 }}>
          💡 {explanation}
        </p>
      )}

      <div style={{ marginTop: 30 }}>
        {canClick ? (
          <small style={{ opacity: 0.95 }}>Click to continue</small>
        ) : (
          <small style={{ opacity: 0.7 }}>Please wait...</small>
        )}
      </div>
    </div>
  );
}
