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
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 9999,
      }}
    >
      {/* Modal Card */}
      <div
        style={{
          background: "white",
          borderRadius: "40px",
          padding: "50px 40px",
          width: "95%",
          maxWidth: "540px",
          color: "#222",
          fontFamily: "Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 10px 26px rgba(0,0,0,0.28)",
          border: "3px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          style={{
            position: "absolute",
            top: "18px",
            right: "22px",
            background: "rgba(0,0,0,0.05)",
            border: "2px solid rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: "pointer",
            color: "#333",
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

        <p
          style={{
            marginBottom: "30px",
            opacity: 0.85,
            fontSize: "1.05rem",
            lineHeight: "1.45",
          }}
        >
          To access this feature, you need to be signed in.  
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
          {/* Sign Up */}
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
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Sign Up
          </Link>

          {/* Log In */}
          <Link
            href="/login"
            style={{
              padding: "16px 0",
              borderRadius: "12px",
              border: "2px solid rgba(0,0,0,0.2)",
              backgroundColor: "rgba(0,0,0,0.04)",
              color: "#222",
              fontWeight: 700,
              fontSize: "1.05rem",
              backdropFilter: "blur(4px)",
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
