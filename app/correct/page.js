"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function CorrectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const question = searchParams.get("question") || "";
  const userAnswer = searchParams.get("userAnswer") || "";
  const correctAnswer = searchParams.get("correctAnswer") || "";
  const explanation = searchParams.get("explanation") || "";
  const index = Number(searchParams.get("index") ?? 0);
  const topic = searchParams.get("topic") || "";

  const [questions, setQuestions] = useState([]);
  const [showAd, setShowAd] = useState(false);
  const [canClick, setCanClick] = useState(false);

  // Load test data and enable click after 2.5s
  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) setQuestions(JSON.parse(stored));

    const t = setTimeout(() => setCanClick(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Show ad if current index is in adIndexes
  useEffect(() => {
    const adIndexes = (sessionStorage.getItem("adIndexes") || "")
      .split(",")
      .map(Number);
    if (adIndexes.includes(index)) {
      setShowAd(true);

      // Inject Monetag script once
      const existing = document.querySelector("script[data-zone='10137448']");
      if (!existing) {
        const script = document.createElement("script");
        script.dataset.zone = "10137448";
        script.src = "https://groleegni.net/vignette.min.js";
        document.body.appendChild(script);
      }

      const t = setTimeout(() => setShowAd(false), 5000);
      return () => clearTimeout(t);
    }
  }, [index]);

  const handleContinue = () => {
    if (showAd || !canClick) return;
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
        background: "linear-gradient(to right, #81c784, #388e3c)",
        color: "white",
        textAlign: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        cursor: showAd ? "default" : "pointer",
        padding: "20px"
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 12 }}>✅</div>
      <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 800 }}>Correct!</h1>

      <div style={{ maxWidth: 760, marginBottom: 10 }}>
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

      <div style={{ marginTop: 30, borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: 12 }}>
        <small style={{ opacity: 0.95 }}>
          {showAd ? "Please wait for the ad..." : "Click to continue"}
        </small>
      </div>
    </div>
  );
}

export default function CorrectPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "40vh" }}>Loading...</div>}>
      <CorrectContent />
    </Suspense>
  );
}
