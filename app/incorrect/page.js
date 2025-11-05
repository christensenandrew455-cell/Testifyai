"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function IncorrectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextIndex = Number(searchParams.get("index") || 0) + 1;
  const question = searchParams.get("question") || "";
  const userAnswer = searchParams.get("userAnswer") || "";
  const correctAnswer = searchParams.get("correctAnswer") || "";
  const explanation = searchParams.get("explanation") || "";
  const topic = searchParams.get("topic") || "Unknown Topic";

  // ✅ Automatically go to next question after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        if (nextIndex < data.length) {
          router.push(`/testchat?topic=${encodeURIComponent(topic)}`);
          sessionStorage.setItem("resumeIndex", nextIndex);
        } else {
          router.push("/ad");
        }
      } else {
        router.push("/results");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [nextIndex, router, topic]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffebee",
        color: "#c62828",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>❌ Incorrect</h1>
      <p style={{ marginTop: "12px", fontSize: "1.1rem" }}>{question}</p>
      <p style={{ marginTop: "6px", color: "#b71c1c" }}>
        Your Answer: <strong>{userAnswer}</strong>
      </p>
      <p style={{ marginTop: "6px", color: "#1b5e20" }}>
        Correct Answer: <strong>{correctAnswer}</strong>
      </p>
      {explanation && (
        <p style={{ marginTop: "12px", color: "#555", maxWidth: "600px" }}>
          {explanation}
        </p>
      )}
      <p style={{ marginTop: "20px", color: "#777" }}>
        Loading next question...
      </p>
    </div>
  );
}
