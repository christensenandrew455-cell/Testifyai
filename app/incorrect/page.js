"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IncorrectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = Number(searchParams.get("current")) || 0;
  const total = Number(searchParams.get("total")) || 1;
  const selectedIndex = Number(searchParams.get("selected"));
  const [questionObj, setQuestionObj] = useState(null);
  const [clickable, setClickable] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("testData");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr[current]) {
          setQuestionObj(arr[current]);
        }
      }
    } catch (e) {
      console.error("Error loading testData:", e);
    }

    // Wait 2.5s before allowing clicks
    const timer = setTimeout(() => setClickable(true), 2500);
    return () => clearTimeout(timer);
  }, [current]);

  const handleClick = () => {
    if (!clickable) return;
    if (current + 1 < total) {
      router.push(`/testchat?start=${current + 1}`);
    } else {
      router.push("/results");
    }
  };

  const userAnswerText =
    questionObj && Array.isArray(questionObj.answers) && !isNaN(selectedIndex)
      ? questionObj.answers[selectedIndex]
      : "Unknown";

  const correctText =
    questionObj && questionObj.correct !== undefined
      ? typeof questionObj.correct === "number"
        ? questionObj.answers[questionObj.correct]
        : questionObj.correct
      : "Unknown";

  const explanation =
    questionObj && questionObj.explanation
      ? questionObj.explanation
      : "Explanation unavailable.";

  return (
    <div
      onClick={handleClick}
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #e57373, #c62828)",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        cursor: clickable ? "pointer" : "default",
        transition: "opacity 0.3s ease",
        padding: "20px",
      }}
    >
      {/* Big red X */}
      <div
        style={{
          fontSize: "120px",
          fontWeight: "bold",
          marginBottom: "20px",
          userSelect: "none",
          opacity: 0.9,
        }}
      >
        ✖
      </div>

      {/* Main text */}
      <div style={{ fontSize: "1.6rem", marginBottom: "8px", fontWeight: 800 }}>
        Incorrect
      </div>

      <div style={{ fontSize: "1.05rem", marginBottom: "6px" }}>
        Your answer was: <b>{userAnswerText}</b>
      </div>

      <div style={{ fontSize: "1.05rem", marginBottom: "12px" }}>
        The correct answer is: <b>{correctText}</b>
      </div>

      <div
        style={{
          fontSize: "1rem",
          maxWidth: "760px",
          opacity: 0.95,
          marginBottom: "18px",
          lineHeight: 1.4,
        }}
      >
        {explanation}
      </div>

      {/* Click to continue (appears after 2.5s) */}
      {clickable && (
        <div
          style={{
            fontSize: "0.95rem",
            marginTop: "8px",
            opacity: 0.95,
            animation: "fadeIn 0.4s ease-in-out",
          }}
        >
          click to continue →
        </div>
      )}
    </div>
  );
}
