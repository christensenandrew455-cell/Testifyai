"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function IncorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const question = searchParams.get("question") || "";
  const userAnswer = searchParams.get("userAnswer") || "";
  const correctAnswer = searchParams.get("correctAnswer") || "";
  const explanation = searchParams.get("explanation") || "";
  const index = Number(searchParams.get("index") ?? 0);
  const topic = searchParams.get("topic") || "";

  const [questions, setQuestions] = useState([]);
  const [canClick, setCanClick] = useState(false);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) setQuestions(JSON.parse(stored));
    const t = setTimeout(() => setCanClick(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Show ad if this question is an ad index
  useEffect(() => {
    const adIndexes = (sessionStorage.getItem("adIndexes") || "")
      .split(",")
      .map(Number);
    if (adIndexes.includes(index)) {
      setShowAd(true);
      const t = setTimeout(() => setShowAd(false), 5000);
      return () => clearTimeout(t);
    }
  }, [index]);

  const handleContinue = () => {
    if (!canClick || showAd) return;
    const isLast = questions.length > 0 ? index >= questions.length - 1 : false;
    if (isLast) {
      router.push(`/ad?topic=${encodeURIComponent(topic)}`);
    } else {
      sessionStorage.setItem("resumeIndex", String(index + 1));
      router.push(`/testchat?topic=${encodeURIComponent(topic)}`);
    }
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
        background: "linear-gradient(to right, #ff8a80, #e53935)",
        color: "white",
        textAlign: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        cursor: canClick && !showAd ? "pointer" : "default",
        padding: "20px"
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 12 }}>❌</div>
      <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 800 }}>Incorrect</h1>
      <div style={{ maxWidth: 760, marginBottom: 10, textAlign: "left" }}>
        <p><strong>Question:</strong> {question}</p>
        <p><strong>Your answer:</strong> {userAnswer}</p>
        <p><strong>Correct answer:</strong> {correctAnswer}</p>
      </div>
      {explanation && (
        <p style={{ maxWidth: 760, marginTop: 12, opacity: 0.95 }}>💡 {explanation}</p>
      )}
      {showAd && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.3rem",
          zIndex: 9999
        }}>
          Loading ad...
        </div>
      )}
      <div style={{ marginTop: 30 }}>
        {canClick ? (
          <small style={{ opacity: 0.95 }}>
            {showAd ? "Please wait for the ad..." : "Click to continue"}
          </small>
        ) : (
          <small style={{ opacity: 0.7 }}>Please wait...</small>
        )}
      </div>
    </div>
  );
}

export default function IncorrectPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "40vh" }}>Loading...</div>}>
      <IncorrectContent />
    </Suspense>
  );
}
