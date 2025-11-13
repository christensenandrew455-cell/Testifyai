"use client";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Correct2Content() {
  const router = useRouter();
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanContinue(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (!canContinue) return;
    router.push("/test/controller"); // adjust next page
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
        transition: "opacity 0.3s ease",
        opacity: canContinue ? 1 : 0.8,
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Correct!</h1>
      <p style={{ fontSize: 18, marginBottom: 30 }}>Great job — you nailed it!</p>
      <small>{canContinue ? "Click anywhere to continue" : "Please wait..."}</small>
    </div>
  );
}

export default function Correct2Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Segoe UI, Roboto, sans-serif", fontSize: "1.4rem", color: "#1976d2" }}>Loading result…</div>}>
      <Correct2Content />
    </Suspense>
  );
}
