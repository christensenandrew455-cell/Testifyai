"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IncorrectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = Number(searchParams.get("current")) || 0;
  const total = Number(searchParams.get("total")) || 1;
  const selectedIndex = Number(searchParams.get("selected"));

  const [canClick, setCanClick] = useState(false);
  const [questionObj, setQuestionObj] = useState(null);

  useEffect(() => {
    // load testData from localStorage
    try {
      const raw = localStorage.getItem("testData");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr[current]) {
          setQuestionObj(arr[current]);
        } else {
          console.warn("testData missing current index");
        }
      } else {
        console.warn("no testData in localStorage");
      }
    } catch (e) {
      console.error("Failed to read testData from localStorage", e);
    }

    const timer = setTimeout(() => setCanClick(true), 2500);
    return () => clearTimeout(timer);
  }, [current]);

  const handleClick = () => {
    if (!canClick) return;
    // advance to next question or to results
    if (current + 1 < total) {
      // pass next index to testchat - we can navigate back to testchat and let it read from localStorage
      router.push(`/testchat?topic=${encodeURIComponent(
        // keep topic param if available
        // read topic from stored question if exists, else fallback
        (questionObj && questionObj.topic) || ""
      )}&start=${current + 1}`);
    } else {
      router.push("/results");
    }
  };

  const userAnswerText =
    questionObj && Array.isArray(questionObj.answers) && !isNaN(selectedIndex)
      ? questionObj.answers[selectedIndex]
      : "Unknown";

  // The API should place the correct answer either as a string at `questionObj.correct`
  // or `questionObj.correct` may be the correct answer string. We handle both:
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
        background: "linear-gradient(to right, #ff8a80, #e53935)",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        cursor: canClick ? "pointer" : "default",
        transition: "opacity 0.3s ease",
        padding: "20px",
      }}
    >
      {/* Big Red X */}
      <div
        style={{
          fontSize: "120px",
          fontWeight: "bold",
          marginBottom: "20px",
          userSelect: "none",
          opacity: 0.95,
        }}
      >
        ✖
      </div>

      {/* Text Details */}
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

      {/* "Click to Continue" text appears after delay */}
      {canClick && (
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
