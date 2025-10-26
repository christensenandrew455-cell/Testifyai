// app/page.js
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        /* fallback */
        color: "#1f2937",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 900, width: "100%", padding: "2rem" }}>
        <h1 style={{
          fontSize: "3.25rem",
          lineHeight: 1.05,
          fontWeight: 800,
          color: "white",
          marginBottom: "0.75rem",
          textShadow: "0 2px 6px rgba(0,0,0,0.25)",
        }}>
          Welcome to TestifyAI
        </h1>

        <p style={{
          fontSize: "1.125rem",
          color: "rgba(255,255,255,0.95)",
          maxWidth: 720,
          margin: "0 auto 1.25rem",
        }}>
          For all your testing needs — powered by AI precision.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "1rem",
        }}>
          <Link href="/test" style={{ textDecoration: "none" }}>
            <a className="btn-primary">Test Me</a>
          </Link>

          <Link href="/learn" style={{ textDecoration: "none" }}>
            <a className="btn-primary btn-secondary">Learn More</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
