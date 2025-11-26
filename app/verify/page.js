"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";

export default function VerifyPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const signupData = JSON.parse(localStorage.getItem("signupData"));

  async function handleContinue() {
    setChecking(true);

    // Reload Firebase user
    await auth.currentUser.reload();

    if (auth.currentUser.emailVerified) {
      router.push("/profile");
    } else {
      alert("Your email is not verified yet. Please check your inbox.");
    }

    setChecking(false);
  }

  return (
    <div style={{
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
    }}>
      <div style={{ position: "absolute", top: "20px", right: "30px", fontWeight: 700, fontSize: "1.2rem" }}>
        TheTestifyAI
      </div>

      <div style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        borderRadius: "40px",
        border: "3px solid rgba(255,255,255,0.18)",
        padding: "40px 44px",
        width: "92%",
        maxWidth: "520px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.4rem" }}>Verify Your Email</h2>

        <p style={{ opacity: 0.9 }}>
          We sent a verification link to <b>{signupData?.email}</b>.  
          <br /><br />
          Click the link, then press the button below.
        </p>

        <button onClick={handleContinue} disabled={checking} style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: "12px",
          border: "none",
          backgroundColor: checking ? "#9ec4ff" : "#1976d2",
          color: "white",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: checking ? "not-allowed" : "pointer",
        }}>
          {checking ? "Checking..." : "I Verified My Email"}
        </button>

        <a href="/signup" style={{ color: "white", opacity: 0.85, fontSize: "0.9rem" }}>
          Back to Signup
        </a>
      </div>
    </div>
  );
}
