"use client";

import TestController from "./controller/page";

export default function TestPage() {
  return <TestController />;
}

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Unified Test Controller Page
 *
 * - Expects sessionStorage.testData to contain the normalized test object:
 *   { topic, difficulty, totalQuestions, questions: [ { index, id, type, question, answers?, correct?, explanation? } ] }
 *
 * Behavior:
 * - Reorders questions so that all non-short/open types appear first (in original order),
 *   then all short-answer, then all open-response (as requested).
 * - Renders unified UI shell and plugs in per-type rendering logic.
 * - For choice-based types: grades client-side, shows feedback overlay + explanation,
 *   waits 2 seconds, then advances.
 * - For short-answer / open-response: records answer and routes to /incorrect (matching your existing flow).
 */

function ChoiceButtons({ answers = [], onSelect, disabled, selected }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {answers.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <button
            key={i}
            onClick={() => !disabled && onSelect(i)}
            disabled={disabled}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              textAlign: "left",
              cursor: disabled ? "not-allowed" : "pointer",
              backgroundColor: isSelected ? "#0ea5e9" : "rgba(255,255,255,0.06)",
              color: isSelected ? "#fff" : "#fff",
              border: isSelected ? "2px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.06)",
              fontWeight: 600,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectChoices({ answers = [], selectedIndexes = [], onToggle, disabled }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {answers.map((opt, i) => {
        const checked = selectedIndexes.includes(i);
        return (
          <button
            key={i}
            onClick={() => !disabled && onToggle(i)}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 10,
              cursor: disabled ? "not-allowed" : "pointer",
              backgroundColor: checked ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
              border: checked ? "2px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.06)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: checked ? "4px solid #10b981" : "2px solid rgba(255,255,255,0.3)",
                backgroundColor: checked ? "#10b981" : "transparent",
              }}
            />
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function TestController() {
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [orderedQuestions, setOrderedQuestions] = useState([]);
  const [index, setIndex] = useState(0);

  // UI state for answers and feedback
  const [selectedIndex, setSelectedIndex] = useState(null); // for single-choice or true/false
  const [multiSelected, setMultiSelected] = useState([]); // for multi-select
  const [textAnswer, setTextAnswer] = useState(""); // for short/open
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load test from sessionStorage on mount
  useEffect(() => {
    const raw = sessionStorage.getItem("testData");
    if (!raw) {
      alert("No test data found — please generate a test first.");
      router.push("/");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      // Expected parsed: { topic, difficulty, totalQuestions, questions: [...] }
      setTest(parsed);

      // Reorder questions per your rule:
      // non-short/open (in original order) first, then short-answer, then open-response
      const nonShortOpen = parsed.questions.filter((q) => q.type !== "short-answer" && q.type !== "open-response");
      const shortAnswer = parsed.questions.filter((q) => q.type === "short-answer");
      const openResponse = parsed.questions.filter((q) => q.type === "open-response");
      const combined = [...nonShortOpen, ...shortAnswer, ...openResponse];

      setOrderedQuestions(combined);
      // initialize session data (ensure it's stored consistently)
      sessionStorage.setItem("testData", JSON.stringify({ ...parsed, questions: combined }));
    } catch (err) {
      console.error("Invalid test data in sessionStorage", err);
      alert("Invalid test data — please regenerate.");
      router.push("/");
    }
  }, [router]);

  // Derived current question
  const current = orderedQuestions[index];

  useEffect(() => {
    // reset per-question UI state
    setSelectedIndex(null);
    setMultiSelected([]);
    setTextAnswer("");
    setShowFeedback(false);
    setFeedbackCorrect(false);
  }, [index, orderedQuestions]);

  if (!test || orderedQuestions.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div>Loading test...</div>
      </div>
    );
  }

  const total = orderedQuestions.length;
  const progressText = `Question ${index + 1} of ${total}`;

  // Helper: write back user answer into sessionData
  function saveUserAnswer(qIndex, answerObj) {
    try {
      const raw = sessionStorage.getItem("testData");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed.questions || !Array.isArray(parsed.questions)) return;

      // find question by id in parsed.questions
      const idx = parsed.questions.findIndex((q) => q.id === orderedQuestions[qIndex].id);
      if (idx >= 0) {
        parsed.questions[idx].userAnswer = answerObj;
        sessionStorage.setItem("testData", JSON.stringify(parsed));
      }
    } catch (err) {
      console.error("Failed to save user answer:", err);
    }
  }

  // Handler for checking choice-based answers
  const checkChoiceAnswer = (type) => {
    if (!current) return;
    // For multiple-choice and true-false: single selection index -> compare to current.correct
    if (type === "multiple-choice" || type === "true-false") {
      if (selectedIndex === null) return; // nothing selected
      // current.correct might be string (like "C" or actual option text). We'll support both:
      const userOpt = current.answers ? current.answers[selectedIndex] : null;
      const correctRaw = current.correct;

      // If current.correct is an index (number) use that, otherwise compare text
      let correct = false;
      if (typeof correctRaw === "number") {
        correct = selectedIndex === correctRaw;
      } else if (typeof correctRaw === "string") {
        // allow both letter labels like "A" or exact option text
        const letter = String.fromCharCode(65 + selectedIndex); // A..
        correct = correctRaw === letter || (userOpt && correctRaw === userOpt);
      } else {
        // fallback: compare text
        correct = userOpt && current.correct && userOpt.trim() === String(current.correct).trim();
      }

      setFeedbackCorrect(Boolean(correct));
      setShowFeedback(true);
      saveUserAnswer(index, { selectedIndex, selectedValue: userOpt, isCorrect: Boolean(correct) });

      // after 2 seconds advance
      setTimeout(() => {
        if (index + 1 < total) setIndex((i) => i + 1);
        else {
          // complete
          router.push("/complete"); // or show completion UI
        }
      }, 2000);
    }

    // For multi-select: compare arrays (order independent)
    if (type === "multi-select") {
      if (!Array.isArray(multiSelected) || multiSelected.length === 0) return;
      // current.correct should be an array of correct option TEXTS or letters
      const correctRaw = current.correct || [];
      // normalize to option indices if necessary
      // We'll compare by text: convert selectedIndexes -> texts
      const selectedTexts = multiSelected.map((i) => current.answers[i]);
      // If correctRaw elements are letters like "A" convert to index -> text
      const normalizedCorrectTexts = correctRaw.map((c) => {
        if (typeof c === "number") return current.answers[c];
        if (typeof c === "string" && /^[A-F]$/.test(c.trim())) {
          const idx = c.trim().charCodeAt(0) - 65;
          return current.answers[idx];
        }
        return String(c);
      });

      // Compare sets (case-insensitive)
      const sSet = new Set(selectedTexts.map((s) => String(s).trim().toLowerCase()));
      const cSet = new Set(normalizedCorrectTexts.map((s) => String(s).trim().toLowerCase()));

      const isEqual =
        sSet.size === cSet.size && [...sSet].every((v) => cSet.has(v));

      setFeedbackCorrect(isEqual);
      setShowFeedback(true);
      saveUserAnswer(index, { selectedIndexes: multiSelected, selectedValues: selectedTexts, isCorrect: isEqual });

      setTimeout(() => {
        if (index + 1 < total) setIndex((i) => i + 1);
        else router.push("/complete");
      }, 2000);
    }
  };

  // Handler for short-answer / open-response: save and route to /incorrect page (as your earlier components did)
  const handleTextSubmit = () => {
    if (!current || !textAnswer.trim()) return;

    // Save answer
    saveUserAnswer(index, { userText: textAnswer.trim(), isCorrect: null });

    // Build query and navigate to your existing incorrect page (keeps behavior consistent)
    const query = new URLSearchParams({
      question: current.question || "",
      userAnswer: textAnswer.trim(),
      correctAnswer: current.correct ? JSON.stringify(current.correct) : "",
      explanation: current.explanation || "",
      index: String(index),
      topic: test.topic || "",
    }).toString();

    // For short-answer you may want to go to a "short-answer review" page — using /incorrect as in your earlier code
    router.push(`/incorrect?${query}`);
  };

  // UI render for current question based on type
  const renderQuestionUI = () => {
    const q = current;
    if (!q) return null;

    const type = q.type;

    // common question box
    const questionBox = (
      <div
        style={{
          border: "3px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          backgroundColor: "rgba(0,0,0,0.34)",
          width: "100%",
          maxWidth: 900,
          padding: 24,
          color: "#fff",
          fontSize: 18,
          fontWeight: 600,
          boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
        }}
      >
        {q.question}
      </div>
    );

    // Render by type
    if (type === "multiple-choice") {
      return (
        <>
          {questionBox}
          <div style={{ marginTop: 18, width: "100%", maxWidth: 700 }}>
            <ChoiceButtons
              answers={q.answers || []}
              onSelect={(i) => setSelectedIndex(i)}
              disabled={showFeedback}
              selected={selectedIndex}
            />
          </div>

          <div style={{ marginTop: 22 }}>
            <button
              onClick={() => checkChoiceAnswer("multiple-choice")}
              disabled={showFeedback || selectedIndex === null}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                backgroundColor: showFeedback ? "gray" : "#1976d2",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: selectedIndex === null ? "not-allowed" : "pointer",
              }}
            >
              Check Answer
            </button>
          </div>
        </>
      );
    }

    if (type === "true-false") {
      return (
        <>
          {questionBox}
          <div style={{ marginTop: 18, width: "100%", maxWidth: 400 }}>
            <ChoiceButtons
              answers={["True", "False"]}
              onSelect={(i) => setSelectedIndex(i)}
              disabled={showFeedback}
              selected={selectedIndex}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <button
              onClick={() => checkChoiceAnswer("true-false")}
              disabled={showFeedback || selectedIndex === null}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                backgroundColor: showFeedback ? "gray" : "#1976d2",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: selectedIndex === null ? "not-allowed" : "pointer",
              }}
            >
              Check Answer
            </button>
          </div>
        </>
      );
    }

    if (type === "multi-select") {
      return (
        <>
          {questionBox}
          <div style={{ marginTop: 18, width: "100%", maxWidth: 700 }}>
            <MultiSelectChoices
              answers={q.answers || []}
              selectedIndexes={multiSelected}
              onToggle={(i) =>
                setMultiSelected((prev) => {
                  const exists = prev.includes(i);
                  return exists ? prev.filter((x) => x !== i) : [...prev, i];
                })
              }
              disabled={showFeedback}
            />
          </div>

          <div style={{ marginTop: 22 }}>
            <button
              onClick={() => checkChoiceAnswer("multi-select")}
              disabled={showFeedback || multiSelected.length === 0}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                backgroundColor: showFeedback ? "gray" : "#1976d2",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: multiSelected.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Check Answer
            </button>
          </div>
        </>
      );
    }

    // For short-answer and open-response: input + Check Answer -> route to /incorrect (existing)
    if (type === "short-answer" || type === "open-response") {
      const isShort = type === "short-answer";
      return (
        <>
          {questionBox}
          <div style={{ marginTop: 18 }}>
            {isShort ? (
              <textarea
                rows={3}
                placeholder="Type your short answer..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: 700,
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#fff",
                  fontSize: 16,
                }}
              />
            ) : (
              <input
                type="text"
                placeholder="Type your response..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: 700,
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#fff",
                  fontSize: 16,
                }}
              />
            )}
          </div>

          <div style={{ marginTop: 18 }}>
            <button
              onClick={handleTextSubmit}
              disabled={!textAnswer.trim()}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                backgroundColor: !textAnswer.trim() ? "gray" : "#1976d2",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: !textAnswer.trim() ? "not-allowed" : "pointer",
              }}
            >
              Check Answer
            </button>
          </div>
        </>
      );
    }

    // fallback
    return (
      <>
        {questionBox}
        <div style={{ marginTop: 18 }}>Unknown question type: {q.type}</div>
      </>
    );
  };

  // Simple topbar with Leave
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
        padding: "28px 18px",
        background: "linear-gradient(90deg,#0f172a 0%, #0ea5e9 100%)",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => {
            if (confirm("Leave test and return to home? Your progress will be saved.")) {
              router.push("/");
            }
          }}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            background: "#111827",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Leave
        </button>

        <div style={{ fontWeight: 800, fontSize: 18 }}>{test.topic || "Test"}</div>

        <div style={{ fontWeight: 700 }}>{progressText}</div>
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 920 }}>{renderQuestionUI()}</div>
      </div>

      {/* Feedback overlay */}
      {showFeedback && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            zIndex: 60,
          }}
        >
          <div
            style={{
              background: feedbackCorrect ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
              border: `2px solid ${feedbackCorrect ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"}`,
              padding: 26,
              borderRadius: 14,
              color: "#fff",
              textAlign: "center",
              minWidth: 320,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {feedbackCorrect ? "✅ Correct" : "❌ Incorrect"}
            </div>
            <div style={{ marginTop: 10, fontSize: 14, opacity: 0.95 }}>
              {current?.explanation || "No explanation provided."}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, opacity: 0.9 }}>Advancing...</div>
          </div>
        </div>
      )}
    </div>
  );
}
