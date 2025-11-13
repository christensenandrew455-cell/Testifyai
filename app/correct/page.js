"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function CorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const question = searchParams.get("question") || "No question provided";
  const userAnswer = searchParams.get("userAnswer") || "—";
  const feedback = searchParams.get("feedback") || "";

  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanContinue(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (!canContinue) return;
    router.push("/test/controller");
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
        cursor: canContinue ? "pointer" : "default",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Correct!</h1>

      <div style={{ maxWidth: 760, marginBottom: 16, textAlign: "center", background: "rgba(255,255,255,0.1)", padding: "16px", borderRadius: "12px" }}>
        <p><strong>Question:</strong></p>
        <p>{question}</p>
        <p><strong>Your answer:</strong></p>
        <p>{userAnswer}</p>
        {feedback && <>
          <p><strong>Explanation:</strong></p>
          <p>{feedback}</p>
        </>}
      </div>

      <small>{canContinue ? "Click anywhere to continue" : "Please wait..."}</small>
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
