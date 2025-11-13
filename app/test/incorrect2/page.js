"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Incorrect2Content() {
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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #ff8a80, #e53935)",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        cursor: canContinue ? "pointer" : "default",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>❌</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Incorrect</h1>

      <div style={{ maxWidth: 760, marginBottom: 16, textAlign: "left", background: "rgba(255,255,255,0.1)", padding: "12px", borderRadius: "10px" }}>
        <p><strong>Question:</strong> {question}</p>
        <p><strong>Your answer:</strong> {userAnswer}</p>
        {feedback && <p><strong>Explanation:</strong> {feedback}</p>}
      </div>

      <small>{canContinue ? "Click anywhere to continue" : "Please wait..."}</small>
    </div>
  );
}

export default function Incorrect2Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Segoe UI, Roboto, sans-serif", fontSize: "1.4rem", color: "#1976d2" }}>Loading result…</div>}>
      <Incorrect2Content />
    </Suspense>
  );
}
