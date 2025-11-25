// app/signup/page.js
"use client";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        color: "white",
        textAlign: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          fontWeight: 700,
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        TheTestifyAI
      </div>

      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          borderRadius: "40px",
          border: "3px solid rgba(255,255,255,0.18)",
          padding: "40px 44px",
          width: "92%",
          maxWidth: "520px",
          color: "white",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          marginTop: "20px",
        }}
      >
        <h2 style={{ marginBottom: "10px", fontWeight: 800, fontSize: "1.4rem" }}>
          Create an Account
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "25px" }}>
          <input
            type="text"
            placeholder="Name"
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "white",
            }}
          />

          <input
            type="email"
            placeholder="Email"
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "white",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "white",
            }}
          />

          <input
            type="password"
            placeholder="Re-enter Password"
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "white",
            }}
          />

          <button
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Create Account
          </button>

          <Link href="/login" style={{ marginTop: "10px", color: "white", opacity: 0.8, fontSize: "0.9rem" }}>
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
