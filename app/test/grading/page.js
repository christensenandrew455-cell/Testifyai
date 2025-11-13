"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AILoadingPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    // Simulate grading delay (replace with real grading logic if needed)
    const timer = setTimeout(() => {
      // Once grading is done, go to result (correct/incorrect) page
      const next = params.get("next") || "/correct"; // fallback
      router.push(next);
    }, 3000); // 3 seconds fake grading time

    return () => clearTimeout(timer);
  }, [router, params]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 3rem)",
          fontWeight: 800,
          textShadow: "0 3px 8px rgba(0,0,0,0.25)",
          marginBottom: "1rem",
        }}
      >
        AI is grading your answer...
      </h1>
      <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>
        Please wait a few seconds while we evaluate your response.
      </p>

      <div
        style={{
          marginTop: "40px",
          width: "70px",
          height: "70px",
          border: "6px solid rgba(255,255,255,0.3)",
          borderTopColor: "white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
