"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 9999, // modal on top
      }}
    >
      {/* Card */}
      <div
        style={{
          background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
          borderRadius: "40px",
          padding: "50px 40px",
          width: "95%",
          maxWidth: "540px",
          color: "white",
          fontFamily: "Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 10px 26px rgba(0,0,0,0.22)",
          border: "3px solid rgba(255,255,255,0.22)",
        }}
      >
        {/* X Close Button */}
        <button
          onClick={() => router.back()}
          style={{
            position: "absolute",
            top: "18px",
            right: "22px",
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(6px)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: "pointer",
            color: "white",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            marginBottom: "10px",
            fontWeight: 800,
            fontSize: "1.6rem",
          }}
        >
          Sign In Required
        </h2>

        <p style={{ marginBottom: "30px", opacity: 0.9, fontSize: "1.05rem" }}>
          You need an account to access this feature.  
          Create an account or log in below.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            width: "100%",
          }}
        >
          {/* SIGN UP */}
          <Link
            href="/signup"
            style={{
              padding: "16px 0",
              borderRadius: "12px",
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: 700,
              fontSize: "1.05rem",
              textDecoration: "none",
              display: "block",
            }}
          >
            Sign Up
          </Link>

          {/* LOG IN */}
          <Link
            href="/login"
            style={{
              padding: "16px 0",
              borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.35)",
              backgroundColor: "rgba(255,255,255,0.14)",
              color: "white",
              fontWeight: 700,
              fontSize: "1.05rem",
              backdropFilter: "blur(6px)",
              textDecoration: "none",
              display: "block",
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
