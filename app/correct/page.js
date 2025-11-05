"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CorrectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextIndex = Number(searchParams.get("index") || 0) + 1;
  const question = searchParams.get("question") || "";
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
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>✅ Correct!</h1>
      <p style={{ marginTop: "12px", fontSize: "1.1rem" }}>{question}</p>
      <p style={{ marginTop: "6px", color: "#388e3c" }}>
        Correct Answer: <strong>{correctAnswer}</strong>
      </p>
      {explanation && (
        <p style={{ marginTop: "12px", color: "#2e7d32", maxWidth: "600px" }}>
          {explanation}
        </p>
      )}
      <p style={{ marginTop: "20px", color: "#555" }}>
        Loading next question...
      </p>
    </div>
  );
}
