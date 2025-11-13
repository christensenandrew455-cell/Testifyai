"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const question = searchParams.get("question") || "";
  const userAnswer = JSON.parse(searchParams.get("userAnswer") || "[]");
  const correctAnswer = JSON.parse(searchParams.get("correctAnswer") || "[]");
  const explanation = searchParams.get("explanation") || "";
  const topic = searchParams.get("topic") || "";

  const formatAnswers = (answers) => {
    if (Array.isArray(answers)) {
      return answers.join(", ");
    }
    return answers;
  };

  const handleContinue = () => {
    router.push(`/test?topic=${encodeURIComponent(topic)}`);
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
        background: "linear-gradient(to right, #81c784, #388e3c)",
        color: "white",
        textAlign: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        cursor: "pointer",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 12 }}>✅</div>
      <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 800 }}>Correct!</h1>
      <div style={{ maxWidth: 760, marginBottom: 10 }}>
        <p><strong>Question:</strong> {question}</p>
        <p><strong>Your answer(s):</strong> {formatAnswers(userAnswer)}</p>
        <p><strong>Correct answer(s):</strong> {formatAnswers(correctAnswer)}</p>
      </div>
      {explanation && (
        <p style={{ maxWidth: 760, marginTop: 12, opacity: 0.95 }}>💡 {explanation}</p>
      )}
      <div style={{ marginTop: 30 }}>
        <small>Click anywhere to continue</small>
      </div>
    </div>
  );
}

export default function CorrectPage() {
  return (
    <Suspense fallback={null}>
      <CorrectContent />
    </Suspense>
  );
}
