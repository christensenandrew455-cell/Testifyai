"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Correct2Content() {
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
        background: "linear-gradient(to right, #81c784, #388e3c)",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        cursor: canContinue ? "pointer" : "default",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Correct!</h1>

      <div style={{ maxWidth: 760, textAlign: "center" }}>
        <p style={{ fontWeight: 700 }}>Question</p>
        <p>{question}</p>

        <p style={{ fontWeight: 700, marginTop: 3 }}>Your answer</p>
        <p>{userAnswer}</p>

        {feedback && (
          <>
            <p style={{ fontWeight: 700, marginTop: 3 }}>Explanation</p>
            <p>{feedback}</p>
          </>
        )}
      </div>

      <small style={{ marginTop: 30 }}>
        {canContinue ? "Click anywhere to continue" : "Please wait..."}
      </small>
    </div>
  );
}

export default function Correct2Page() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Segoe UI, Roboto, sans-serif",
            fontSize: "1.4rem",
            color: "#1976d2",
          }}
        >
          Loading result…
        </div>
      }
    >
      <Correct2Content />
    </Suspense>
  );
}
