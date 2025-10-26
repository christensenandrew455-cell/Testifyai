"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CorrectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explanation = searchParams.get("explanation") || "";

  const handleClick = () => {
    router.push("/testchat");
  };

  return (
    <div
      onClick={handleClick}
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#4CAF50", // ✅ Green background
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Checkmark */}
      <div style={{ fontSize: "5rem", marginBottom: "20px" }}>✅</div>

      {/* Title */}
      <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "20px" }}>
        Correct!
      </h1>

      {/* Explanation */}
      {explanation && (
        <p
          style={{
            fontSize: "1.2rem",
            maxWidth: "600px",
            lineHeight: "1.5",
            color: "rgba(255,255,255,0.9)",
            marginBottom: "30px",
          }}
        >
          {explanation}
        </p>
      )}

      {/* Click text */}
      <div
        style={{
          fontSize: "1rem",
          opacity: 0.9,
          fontWeight: 500,
          borderTop: "1px solid rgba(255,255,255,0.3)",
          paddingTop: "10px",
        }}
      >
        Click to continue
      </div>
    </div>
  );
}

export default function CorrectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CorrectPageContent />
    </Suspense>
  );
}
