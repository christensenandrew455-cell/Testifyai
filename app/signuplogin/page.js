"use client";
import Link from "next/link";

export default function SignInPage() {
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
      {/* Top Right Branding (same as TestSetup) */}
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

      {/* Frosted Glass Card (identical style) */}
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
        <h2
          style={{
            marginBottom: "10px",
            fontWeight: 800,
            fontSize: "1.4rem",
          }}
        >
          Sign In Required
        </h2>

        <p style={{ marginBottom: "28px", opacity: 0.9, fontSize: "1rem" }}>
          You need an account to access this feature.  
          Create an account or log in to continue.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
            marginTop: "10px",
          }}
        >
          {/* SIGN UP BUTTON */}
          <Link
            href="/signup"
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
              textDecoration: "none",
              display: "block",
            }}
          >
            Sign Up
          </Link>

          {/* LOG IN BUTTON */}
          <Link
            href="/login"
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.35)",
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              textDecoration: "none",
              display: "block",
              backdropFilter: "blur(6px)",
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
