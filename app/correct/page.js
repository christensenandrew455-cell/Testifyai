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

function stripLeadingLetter(s = "") {
  // remove prefixes like "A. ", "A) ", "A - ", "A: ", case-insensitive
  return String(s).replace(/^[A-Z]\s*[\.\)\-\:]\s*/i, "").trim();
}

function normalizeText(s = "") {
  return stripLeadingLetter(String(s)).trim().toLowerCase();
}

function mapToLetterText(answerValue, questionObj) {
  // answerValue can be string or array
  if (!questionObj || !questionObj.answers) {
    if (Array.isArray(answerValue)) return answerValue.join(", ");
    return String(answerValue);
  }

  const answers = questionObj.answers;

  const mapSingle = (val) => {
    // val may be number (index), letter like "A", or the raw answer text
    if (typeof val === "number") {
      const idx = val;
      const raw = answers[idx] ?? String(val);
      const text = stripLeadingLetter(raw);
      return `${String.fromCharCode(65 + idx)}. ${text}`;
    }

    const s = String(val).trim();

    // letter like "A" or "a"
    if (/^[A-Z]$/i.test(s)) {
      const idx = s.toUpperCase().charCodeAt(0) - 65;
      const raw = answers[idx] ?? s;
      const text = stripLeadingLetter(raw);
      return `${String.fromCharCode(65 + idx)}. ${text}`;
    }

    // try to find by exact match in answers (compare normalized versions)
    const foundIdx = answers.findIndex((a) => normalizeText(a) === normalizeText(s));
    if (foundIdx !== -1) {
      const raw = answers[foundIdx];
      const text = stripLeadingLetter(raw);
      return `${String.fromCharCode(65 + foundIdx)}. ${text}`;
    }

    // fallback: s might already be "A. Duck" or plain text — try to clean it
    const cleaned = stripLeadingLetter(s);
    return cleaned;
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

  const parsedUser = safeJSONParse(rawUser);
  const parsedCorrect = safeJSONParse(rawCorrect);

  // try to get question object from sessionStorage testData using index
  let questionObj = null;
  try {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const parsed = JSON.parse(stored);
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
    // return to controller; controller should read resumeIndex from sessionStorage
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
