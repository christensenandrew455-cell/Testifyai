"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        color: "white",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Logo / Title */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "white",
        }}
      >
        TheTestifyAI
      </div>

      {/* Main Title */}
      <h1
        style={{
          fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
          fontWeight: 800,
          marginBottom: "16px",
          textShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        Welcome to TheTestifyAI
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          maxWidth: "700px",
          opacity: 0.95,
          lineHeight: 1.5,
          marginBottom: "40px",
        }}
      >
        Your personal AI-powered learning assistant — fast, simple, and fun.
      </p>

      {/* Button Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        <button
          onClick={() => router.push("/learn")}
          style={{
            padding: "16px 0",
            fontSize: "1.1rem",
            fontWeight: 700,
            borderRadius: "16px",
            border: "3px solid rgba(255,255,255,0.45)",
            backgroundColor: "rgba(255,255,255,0.18)",
            color: "white",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "0.25s",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.28)")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.18)")
          }
        >
          Learn More
        </button>

        <button
          onClick={() => router.push("/testsetup")}
          style={{
            padding: "16px 0",
            fontSize: "1.1rem",
            fontWeight: 700,
            borderRadius: "16px",
            border: "3px solid rgba(255,255,255,0.7)",
            backgroundColor: "white",
            color: "#1976d2",
            cursor: "pointer",
            transition: "0.25s",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#f2f2f2";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "white";
          }}
        >
          Test Me
        </button>
      </div>
    </div>
  );
}
