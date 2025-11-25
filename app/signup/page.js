"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ---- UPDATE THIS IMPORT IF YOUR firebase file is somewhere else ----
// If you placed firebase in /lib/firebase.js use:
import { auth } from "@/app/firebase.js";
// If you used app/firebase.js use:
// import { auth } from "@/app/firebase";
// If you used src/firebase.js use:
// import { auth } from "@/src/firebase";
// ------------------------------------------------------------------
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
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
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      // set display name
      await updateProfile(userCred.user, { displayName: name });

      // successful signup — navigate to profile
      router.push("/profile");
    } catch (err) {
      // Friendly error messages for common cases
      const message = (err && err.code) ? err.code : (err && err.message) || "Signup failed";
      if (message.includes("auth/email-already-in-use")) {
        setError("This email is already registered. Try logging in.");
      } else if (message.includes("auth/invalid-email")) {
        setError("That email looks invalid.");
      } else if (message.includes("auth/weak-password")) {
        setError("Password is too weak (>= 6 characters).");
      } else {
        setError(typeof err === "string" ? err : String(err.message || err));
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
        onSubmit={handleSignup}
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
        <h2 style={{ marginBottom: "6px", fontWeight: 800, fontSize: "1.4rem" }}>
          Create an Account
        </h2>

        {error && (
          <div style={{ color: "#ffdddd", background: "rgba(0,0,0,0.12)", padding: "10px", borderRadius: 8 }}>
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Re-enter Password"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          style={inputStyle}
        />

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
