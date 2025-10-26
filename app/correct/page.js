"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CorrectPage() {
  const router = useRouter();
  const params = useSearchParams();

  const topic = params.get("topic");
  const selected = params.get("selected");
  const correct = params.get("correct");
  const reason = params.get("reason");

  const questions = JSON.parse(sessionStorage.getItem("testData") || "[]");
  const currentIndex = Number(sessionStorage.getItem("resumeIndex")) || 0;

  const isLastQuestion = currentIndex >= questions.length;

  const goNext = () => {
    if (isLastQuestion) {
      router.push("/ad"); // ✅ go to ad if test is done
    } else {
      router.push("/testchat");
    }
  };

  return (
    <div
      onClick={goNext}
      style={{
        minHeight: "100vh",
        backgroundColor: "#e6f9ec",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#2e7d32",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
      <h1>Correct!</h1>

      <p style={{ marginTop: "20px", fontSize: "1.1rem" }}>
        <strong>Your answer:</strong> {selected}
      </p>
      <p>
        <strong>Explanation:</strong> {reason}
      </p>

      <p style={{ marginTop: "40px", opacity: 0.7 }}>Click anywhere to continue</p>
    </div>
  );
}
