"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function IncorrectContent() {
  const router = useRouter();
  const params = useSearchParams();

  const topic = params.get("topic");
  const selected = params.get("selected");
  const correct = params.get("correct");
  const reason = params.get("reason");

  const [canClick, setCanClick] = useState(false);

  const questions = JSON.parse(sessionStorage.getItem("testData") || "[]");
  const currentIndex = Number(sessionStorage.getItem("resumeIndex")) || 0;
  const isLastQuestion = currentIndex >= questions.length;

  useEffect(() => {
    const timer = setTimeout(() => setCanClick(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const goNext = () => {
    if (!canClick) return;
    if (isLastQuestion) {
      router.push("/ad");
    } else {
      router.push("/testchat");
    }
  };

  return (
    <div
      onClick={goNext}
      style={{
        minHeight: "100vh",
        backgroundColor: "#fdecea",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#c62828",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>❌</div>
      <h1>Incorrect</h1>

      <p style={{ marginTop: "20px", fontSize: "1.1rem" }}>
        <strong>Your answer:</strong> {selected}
      </p>
      <p>
        <strong>Correct answer:</strong> {correct}
      </p>
      <p>
        <strong>Explanation:</strong> {reason}
      </p>

      {canClick ? (
        <p style={{ marginTop: "40px", opacity: 0.7 }}>Click to continue</p>
      ) : (
        <p style={{ marginTop: "40px", opacity: 0.5 }}>Please wait...</p>
      )}
    </div>
  );
}

export default function IncorrectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IncorrectContent />
    </Suspense>
  );
}
