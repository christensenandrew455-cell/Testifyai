"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function IncorrectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explanation = searchParams.get("explanation") || "";
  const [canClick, setCanClick] = useState(false);

  // Wait 2.5 seconds before allowing clicks
  useEffect(() => {
    const timer = setTimeout(() => setCanClick(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (canClick) router.push("/testchat");
  };

  return (
    <div
      onClick={handleClick}
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#F44336", // ❌ Red background
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        cursor: canClick ? "pointer" : "default",
        userSelect: "none",
        transition: "opacity 0.3s ease",
      }}
    >
      {/* X Icon */}
      <div style={{ fontSize: "5rem", marginBottom: "20px" }}>❌</div>

      {/* Title */}
      <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "20px" }}>
        Incorrect
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

      {/* Click to continue (appears after 2.5s) */}
      {canClick && (
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
      )}
    </div>
  );
}

export default function IncorrectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IncorrectPageContent />
    </Suspense>
  );
}
