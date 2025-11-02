"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        color: "#1f2937",
        padding: "2rem",
        margin: 0,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          padding: "2rem",
          wordWrap: "break-word", // ✅ prevents overflow on mobile
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 3.25rem)", // ✅ scales with screen size
            lineHeight: 1.1,
            fontWeight: 800,
            color: "white",
            marginBottom: "0.75rem",
            textShadow: "0 2px 6px rgba(0,0,0,0.25)",
            textAlign: "center", // ✅ ensures it’s centered on all devices
            wordBreak: "break-word", // ✅ ensures long words wrap properly
          }}
        >
          Welcome to <span style={{ display: "inline-block" }}>TheTestifyAI</span>
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "rgba(255,255,255,0.95)",
            maxWidth: 720,
            margin: "0 auto 1.25rem",
            lineHeight: 1.4,
          }}
        >
          Test on any topic using AI for free.
          Click <strong>Test Me</strong> to get started.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}
        >
          <Link
            href="/test"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Test Me
          </Link>

          <Link
            href="/learn"
            className="btn-primary btn-secondary"
            style={{ textDecoration: "none" }}
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
