"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GradingContent() {
  const [statusText, setStatusText] = useState("AI is grading your answer...");
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const dataParam = params.get("data");
    if (!dataParam) {
      setStatusText("No grading data found. Redirecting...");
      setTimeout(() => router.push("/"), 2000); // Graceful redirect
      return;
    }

    let payload;
    try {
      payload = JSON.parse(dataParam);
    } catch (err) {
      console.error("Failed to parse grading data:", err);
      setStatusText("Invalid grading data. Redirecting...");
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    const grade = async () => {
      try {
        const res = await fetch("/api/grade-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: payload.question,
            userAnswer: payload.answer,
            difficulty: payload.difficulty,
            topic: payload.topic,
            type: payload.type || "short-answer", // default type
          }),
        });

        const data = await res.json();

        if (data.correct === true) {
          router.push(`/test/correct2?feedback=${encodeURIComponent(data.feedback || "")}`);
        } else {
          router.push(`/test/incorrect2?feedback=${encodeURIComponent(data.feedback || "")}`);
        }
      } catch (err) {
        console.error("Grading failed:", err);
        setStatusText("An error occurred while grading your answer.");
      }
    };

    grade();
  }, [params, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1976d2, #ff9800)",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{statusText}</h1>
      <div
        style={{
          width: "70px",
          height: "70px",
          border: "6px solid rgba(255,255,255,0.3)",
          borderTopColor: "white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function GradingPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            fontFamily: "Segoe UI, Roboto, sans-serif",
            color: "#1976d2",
          }}
        >
          Preparing AI grading screen…
        </div>
      }
    >
      <GradingContent />
    </Suspense>
  );
}
