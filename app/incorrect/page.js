"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function safeJSONParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function stripLeadingLetter(s = "") {
  return String(s).replace(/^[A-Z]\s*[\.\)\-\:]\s*/i, "").trim();
}

function normalizeText(s = "") {
  return stripLeadingLetter(String(s)).trim().toLowerCase();
}

function mapToLetterText(answerValue, questionObj) {
  if (!questionObj || !questionObj.answers) {
    if (Array.isArray(answerValue)) return answerValue.join(", ");
    return String(answerValue);
  }

  const answers = questionObj.answers;

  const mapSingle = (val) => {
    if (val === null || val === undefined) return "";
    const s = String(val).trim();

    if (!isNaN(Number(s))) {
      const idx = Number(s);
      const raw = answers[idx] ?? String(s);
      return `${String.fromCharCode(65 + idx)}. ${stripLeadingLetter(raw)}`;
    }

    if (/^[A-Z]$/i.test(s)) {
      const idx = s.toUpperCase().charCodeAt(0) - 65;
      const raw = answers[idx] ?? s;
      return `${String.fromCharCode(65 + idx)}. ${stripLeadingLetter(raw)}`;
    }

    const foundIdx = answers.findIndex((a) => normalizeText(a) === normalizeText(s));
    if (foundIdx !== -1) {
      const raw = answers[foundIdx];
      return `${String.fromCharCode(65 + foundIdx)}. ${stripLeadingLetter(raw)}`;
    }

    return stripLeadingLetter(s);
  };

  return Array.isArray(answerValue)
    ? answerValue.map(mapSingle).join(", ")
    : mapSingle(answerValue);
}

function IncorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawQuestion = searchParams.get("question") || "";
  const rawUser = searchParams.get("userAnswer") || '""';
  const rawCorrect = searchParams.get("correctAnswer") || '""';
  const explanation = searchParams.get("explanation") || "";
  const index = Number(searchParams.get("index") || 0);

  const parsedUser = safeJSONParse(rawUser);
  const parsedCorrect = safeJSONParse(rawCorrect);

  let questionObj = null;
  try {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const questionsArr = Array.isArray(parsed) ? parsed : parsed.questions || parsed;
      questionObj = questionsArr?.[index] || null;
    }
  } catch {}

  const displayUser = mapToLetterText(parsedUser, questionObj);
  const displayCorrect = mapToLetterText(parsedCorrect, questionObj);

  const handleContinue = () => {
    router.push(`/test/controller`);
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
        cursor: "pointer",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 12 }}>❌</div>
      <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 800 }}>Incorrect</h1>

      <div style={{ maxWidth: 760, marginBottom: 10, textAlign: "left" }}>
        <p><strong>Question:</strong> {rawQuestion}</p>
        <p><strong>Your answer(s):</strong> {displayUser}</p>
        <p><strong>Correct answer(s):</strong> {displayCorrect}</p>
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

export default function IncorrectPage() {
  return (
    <Suspense fallback={null}>
      <IncorrectContent />
    </Suspense>
  );
}
