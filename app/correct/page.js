"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawQuestion = searchParams.get("question") || "";
  const rawUser = searchParams.get("userAnswer") || "[]";
  const rawCorrect = searchParams.get("correctAnswer") || "[]";
  const explanation = searchParams.get("explanation") || "";
  const index = Number(searchParams.get("index") || 0);

  let parsedUser = [];
  let parsedCorrect = [];

  try {
    parsedUser = JSON.parse(decodeURIComponent(rawUser));
  } catch {}
  try {
    parsedCorrect = JSON.parse(decodeURIComponent(rawCorrect));
  } catch {}

  // Retrieve question object for letter mapping
  let questionObj = null;
  try {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const parsed = JSON.parse(stored);
      questionObj = parsed.questions?.[index] || null;
    }
  } catch {}

  // Map answers to letters (A., B., C.)
  function mapToLetterText(answerValue, questionObj) {
    if (!answerValue) return "—";
    const answers = questionObj?.answers || [];
    const mapSingle = (val) => {
      if (val === null || val === undefined) return "";
      const idx = answers.indexOf(val);
      if (idx !== -1) return `${String.fromCharCode(65 + idx)}. ${val}`;
      return val;
    };
    return Array.isArray(answerValue)
      ? answerValue.map(mapSingle).join(", ")
      : mapSingle(answerValue);
  }

  const displayUser = mapToLetterText(parsedUser, questionObj);
  const displayCorrect = mapToLetterText(parsedCorrect, questionObj);

  const handleContinue = () => {
    sessionStorage.setItem("currentIndex", String(index + 1));
    router.push("/test/controller");
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
      <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 800 }}>
        Correct!
      </h1>

      <div style={{ maxWidth: 760, marginBottom: 10, textAlign: "left" }}>
        <p><strong>Question:</strong> {rawQuestion}</p>
        <p><strong>Your answer(s):</strong> {displayUser}</p>
        <p><strong>Correct answer(s):</strong> {displayCorrect}</p>
      </div>

      {explanation && (
        <p style={{ maxWidth: 760, marginTop: 12, opacity: 0.95 }}>
          💡 {explanation}
        </p>
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
