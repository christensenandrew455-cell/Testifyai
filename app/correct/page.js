"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function CorrectContent() {
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

  function mapToLetterText(answerValue, questionObj) {
    if (answerValue === null || answerValue === undefined) return "—";
    const answers = questionObj?.answers || [];
    const isTrueFalse =
      Array.isArray(answers) &&
      answers.length === 2 &&
      answers.every((a) => ["true", "false"].includes(String(a).trim().toLowerCase()));

    const mapSingle = (val) => {
      if (val === null || val === undefined) return "";
      if (typeof val === "number" && answers[val] !== undefined) {
        const raw = answers[val];
        if (isTrueFalse) return String(raw);
        return `${String.fromCharCode(65 + val)}. ${raw}`;
      }
      if (isTrueFalse || answers.length === 0) return String(val);
      const idx = answers.indexOf(val);
      if (idx !== -1) return `${String.fromCharCode(65 + idx)}. ${val}`;
      return String(val);
    };

    return Array.isArray(answerValue)
      ? answerValue.map(mapSingle).join(", ")
      : mapSingle(answerValue);
  }

  const displayUser = mapToLetterText(parsedUser, questionObj);
  const displayCorrect = mapToLetterText(parsedCorrect, questionObj);

  const handleContinue = () => {
    if (!canContinue) return;
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
        cursor: canContinue ? "pointer" : "default",
        padding: "20px",
        transition: "opacity 0.3s ease",
        opacity: canContinue ? 1 : 0.8,
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 8 }}>✅</div>
      <h1 style={{ fontSize: 28, marginBottom: 8, fontWeight: 800 }}>Correct!</h1>

      <div style={{ maxWidth: 760, textAlign: "center" }}>
        <p style={{ fontWeight: 700, margin: 0 }}>Question</p>
        <p style={{ margin: "2px 0 4px 0" }}>{rawQuestion}</p>

        <p style={{ fontWeight: 700, margin: "4px 0 2px 0" }}>Your answer(s)</p>
        <p style={{ margin: "2px 0 4px 0" }}>{displayUser}</p>

        <p style={{ fontWeight: 700, margin: "4px 0 2px 0" }}>Correct answer(s)</p>
        <p style={{ margin: "2px 0 4px 0" }}>{displayCorrect}</p>

        {explanation && (
          <>
            <p style={{ fontWeight: 700, margin: "4px 0 2px 0" }}>Explanation</p>
            <p style={{ margin: "2px 0 4px 0" }}>{explanation}</p>
          </>
        )}
      </div>

      <small style={{ marginTop: 20 }}>
        {canContinue ? "Click anywhere to continue" : "Please wait..."}
      </small>
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
