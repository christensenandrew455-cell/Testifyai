"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GradingPage() {
  const [statusText, setStatusText] = useState("AI is grading your answer...");
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const dataParam = params.get("data");
    if (!dataParam) {
      setStatusText("No grading data found. Redirecting...");
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    let payload;
    try {
      payload = JSON.parse(dataParam);
    } catch {
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
            type: payload.type || "short-answer",
          }),
        });

        const data = await res.json();

        // send index so correct2/incorrect2 can increment
        const query = new URLSearchParams({
          feedback: data.feedback || "",
          question: payload.question,
          userAnswer: payload.answer,
          index: payload.currentIndex ?? 0,
        });

        if (data.correct) {
          router.push(`/test/correct2?${query.toString()}`);
        } else {
          router.push(`/test/incorrect2?${query.toString()}`);
        }
      } catch (err) {
        console.error(err);
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
