"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function Correct2() {
  const params = useSearchParams();
  const router = useRouter();
  const feedback = params.get("feedback");

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#4caf50",
      color: "white",
      textAlign: "center",
      fontFamily: "Segoe UI, Roboto, sans-serif",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>✅ Correct!</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem", maxWidth: "600px" }}>
        {feedback || "Great job! You nailed it."}
      </p>
      <button
        onClick={() => router.push("/test")}
        style={{
          marginTop: "40px",
          backgroundColor: "white",
          color: "#4caf50",
          fontWeight: 700,
          border: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          cursor: "pointer"
        }}>
        Next Question
      </button>
    </div>
  );
}
