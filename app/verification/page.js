"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function VerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    padding: "14px",
    borderRadius: "12px",
    border: "2px solid rgba(0,0,0,0.2)",
    outline: "none",
    backgroundColor: "white",
    color: "black",
  };

  async function handleVerify(e) {
    e.preventDefault();
    setError("");

    const signupData = JSON.parse(localStorage.getItem("signupData"));
    if (!signupData) return setError("No signup data found. Go back to signup.");

    if (Number(code) !== signupData.otp) return setError("Invalid code");

    setLoading(true);

    try {
      // Create Firebase Auth account
      const userCred = await createUserWithEmailAndPassword(auth, signupData.email, signupData.pass);

      // Set display name
      await updateProfile(userCred.user, { displayName: signupData.name });

      // Add user to Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        name: signupData.name,
        email: signupData.email,
        createdAt: Date.now(),
      });

      localStorage.removeItem("signupData");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Failed to create account.");
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleVerify} style={{
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
        color: "white",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.4rem" }}>Email Verification</h2>
        <p style={{ opacity: 0.9 }}>Enter the 6-digit code sent to your email</p>

        {error && (
          <div style={{ color: "#ffdddd", background: "rgba(0,0,0,0.12)", padding: "10px", borderRadius: 8 }}>
            {error}
          </div>
        )}

        <input type="number" placeholder="Enter code" value={code} onChange={(e) => setCode(e.target.value)} style={inputStyle} />

        <button type="submit" disabled={loading} style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: "12px",
          border: "none",
          backgroundColor: loading ? "#9ec4ff" : "#1976d2",
          color: "white",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
        }}>
          {loading ? "Verifying..." : "Verify & Create Account"}
        </button>

        <a href="/signup" style={{ marginTop: "6px", color: "white", opacity: 0.85, fontSize: "0.9rem" }}>
          Back to Signup
        </a>
      </form>
    </div>
  );
}
