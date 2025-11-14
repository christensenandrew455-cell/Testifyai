"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function IncorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawQuestion = decodeURIComponent(searchParams.get("question") || "No question provided");
  let rawUser = decodeURIComponent(searchParams.get("userAnswer") || "[]");
  let rawCorrect = decodeURIComponent(searchParams.get("correctAnswer") || "[]");
  const explanation = decodeURIComponent(searchParams.get("explanation") || "");
  const index = Number(searchParams.get("index") || 0);

  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanContinue(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  let parsedUser = [];
  let parsedCorrect = [];

  try { parsedUser = JSON.parse(rawUser); } catch { parsedUser = rawUser; }
  try { parsedCorrect = JSON.parse(rawCorrect); } catch { parsedCorrect = rawCorrect; }

  let questionObj = null;
  try {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const parsed = JSON.parse(stored);
      questionObj = parsed.questions?.[index] || null;
    }
  } catch {}

  function mapToLetterText(answerValue) {
    if (!questionObj) return String(answerValue);

    const answers = questionObj.answers || [];
    const isTF = answers.length === 2 && answers.every(a =>
      ["true","false"].includes(String(a).toLowerCase())
    );

    const mapOne = (val) => {
      if (typeof val === "number" && answers[val] !== undefined) {
        if (isTF) return answers[val];
        return `${String.fromCharCode(65 + val)}. ${answers[val]}`;
      }
      return String(val);
    };

    return Array.isArray(answerValue)
      ? answerValue.map(mapOne).join(", ")
      : mapOne(answerValue);
  }

  const displayUser = mapToLetterText(parsedUser);
  const displayCorrect = mapToLetterText(parsedCorrect);

  const handleContinue = () => {
    if (!canContinue) return;

    const stored = sessionStorage.getItem("testData");
    const total = stored ? JSON.parse(stored).questions.length : 0;

    if (index + 1 >= total) {
      router.push("/ad");
      return;
    }

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
        background: "linear-gradient(to right, #ff8a80, #e53935)",
        color: "white",
        textAlign: "center",
        cursor: canContinue ? "pointer" : "default",
        padding: 20,
        opacity: canContinue ? 1 : 0.8,
      }}
    >
      <div style={{ fontSize: 72 }}>❌</div>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Incorrect</h1>

      <p><b>Question</b><br />{rawQuestion}</p>
      <p><b>Your answer</b><br />{displayUser}</p>
      <p><b>Correct answer</b><br />{displayCorrect}</p>

      {explanation && (
        <p><b>Explanation</b><br />{explanation}</p>
      )}

      <small>{canContinue ? "Click to continue" : "Please wait..."}</small>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <IncorrectContent />
    </Suspense>
  );
}
