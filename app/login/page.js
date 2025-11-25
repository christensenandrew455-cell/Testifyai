"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "white",
  };

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push("/profile");
    } catch (err) {
      const code = err?.code || "";
      if (code.includes("user-not-found") || code.includes("wrong-password")) {
        setError("Invalid email or password.");
      } else if (code.includes("invalid-email")) {
        setError("That email looks invalid.");
      } else {
        setError(err.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  }

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

      <form
        onSubmit={handleLogin}
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
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <h2 style={{ marginBottom: "6px", fontWeight: 800, fontSize: "1.4rem" }}>Log In</h2>

        {error && (
          <div style={{ color: "#ffdddd", background: "rgba(0,0,0,0.12)", padding: "10px", borderRadius: 8 }}>
            {error}
          </div>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} style={inputStyle} />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: "12px",
            border: "none",
            backgroundColor: loading ? "#9ec4ff" : "#1976d2",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "6px",
          }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <Link href="/signup" style={{ marginTop: "6px", color: "white", opacity: 0.85, fontSize: "0.9rem" }}>
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
}
