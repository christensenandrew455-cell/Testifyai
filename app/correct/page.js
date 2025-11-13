"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function safeJSONParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    // if it's not JSON, return the raw string
    return raw;
  }
}

function normalizeText(s = "") {
  return String(s).replace(/^[A-Z]\s*[\.\)]\s*/i, "").trim().toLowerCase();
}

function mapToLetterText(answerValue, questionObj) {
  // answerValue can be string or array
  if (!questionObj || !questionObj.answers) {
    // no question context — just return plain text or join array
    if (Array.isArray(answerValue)) return answerValue.join(", ");
    return String(answerValue);
  }

  const answers = questionObj.answers;

  const mapSingle = (val) => {
    // val may already be the raw answer text, or "A", or "A. text"
    // try to find by index or by matching normalized text
    if (typeof val === "number") {
      const idx = val;
      const text = answers[idx] ?? String(val);
      return `${String.fromCharCode(65 + idx)}. ${text}`;
    }
    const s = String(val).trim();

    // letter like "A" or "a"
    if (/^[A-Z]$/i.test(s)) {
      const idx = s.toUpperCase().charCodeAt(0) - 65;
      const text = answers[idx] ?? s;
      return `${String.fromCharCode(65 + idx)}. ${text}`;
    }

    // try to find by exact match in answers (case-insensitive / stripped)
    const foundIdx = answers.findIndex((a) => normalizeText(a) === normalizeText(s));
    if (foundIdx !== -1) {
      return `${String.fromCharCode(65 + foundIdx)}. ${answers[foundIdx]}`;
    }

    // fallback: show as-is (no letter)
    return String(s);
  };

  if (Array.isArray(answerValue)) {
    return answerValue.map(mapSingle).join(", ");
  }
  return mapSingle(answerValue);
}

function CorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawQuestion = searchParams.get("question") || "";
  const rawUser = searchParams.get("userAnswer") || '""';
  const rawCorrect = searchParams.get("correctAnswer") || '""';
  const explanation = searchParams.get("explanation") || "";
  const index = Number(searchParams.get("index") || 0);
  const topic = searchParams.get("topic") || "";

  // parse answers (they were JSON.stringify'd when navigating)
  const parsedUser = safeJSONParse(rawUser);
  const parsedCorrect = safeJSONParse(rawCorrect);

  // try to get question object from sessionStorage testData using index
  let questionObj = null;
  try {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const parsed = JSON.parse(stored);
      // original testData might be { questions: [...] } or an array
      const questionsArr = Array.isArray(parsed) ? parsed : parsed.questions || parsed;
      if (Array.isArray(questionsArr) && questionsArr[index]) {
        questionObj = questionsArr[index];
      }
    }
  } catch (e) {
    questionObj = null;
  }

  const displayUser = mapToLetterText(parsedUser, questionObj);
  const displayCorrect = mapToLetterText(parsedCorrect, questionObj);

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

export default function CorrectPage() {
  return (
    <Suspense fallback={null}>
      <CorrectContent />
    </Suspense>
  );
}
