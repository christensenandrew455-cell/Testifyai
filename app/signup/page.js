"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

  const inputStyle = {
    padding: "14px",
    borderRadius: "12px",
    border: "2px solid rgba(0,0,0,0.2)",
    outline: "none",
    backgroundColor: "white",
    color: "black",
  };

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !pass || !pass2) {
      setError("Please fill out all fields.");
      return;
    }
    if (pass !== pass2) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);

    try {
      // Create the account
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      // Set display name immediately
      await updateProfile(userCred.user, { displayName: name });

      // Send verification email
      await sendEmailVerification(userCred.user);

      // Show verification screen
      setVerifySent(true);

    } catch (err) {
      const message = err.code || err.message || "Signup failed";

      if (message.includes("auth/email-already-in-use")) {
        setError("This email is already registered. Try logging in.");
      } else if (message.includes("auth/invalid-email")) {
        setError("That email looks invalid.");
      } else if (message.includes("auth/weak-password")) {
        setError("Password is too weak (>= 6 characters).");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  // -----------------------
  // VERIFICATION SCREEN
  // -----------------------
  if (verifySent) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
          Verify Your Email
        </h2>

        <p style={{ maxWidth: "400px", opacity: 0.9, lineHeight: "1.4rem" }}>
          We've sent a verification link to <strong>{email}</strong>.  
          Please verify your email before logging in.
        </p>

        <Link href="/login" style={{ marginTop: "20px", color: "white", fontWeight: "bold" }}>
          Go to Login
        </Link>
      </div>
    );
  }

  // -----------------------
  // SIGNUP FORM
  // -----------------------
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
      <form
        onSubmit={handleSignup}
        style={{
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
        }}
      >
        <h2 style={{ fontWeight: 800, fontSize: "1.4rem" }}>Create an Account</h2>

        {error && (
          <div style={{ color: "#ffdddd", background: "rgba(0,0,0,0.12)", padding: "10px", borderRadius: 8 }}>
            {error}
          </div>
        )}

        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Re-enter Password" value={pass2} onChange={(e) => setPass2(e.target.value)} style={inputStyle} />

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
          {loading ? "Creating..." : "Create Account"}
        </button>

        <Link href="/login" style={{ marginTop: "6px", color: "white", opacity: 0.85, fontSize: "0.9rem" }}>
          Already have an account? Log in
        </Link>
      </form>
    </div>
  );
}
