"use client";
import { useState } from "react";
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

    if (!name || !email || !pass || !pass2) return setError("Please fill out all fields.");
    if (pass !== pass2) return setError("Passwords do not match.");

    setLoading(true);

    try {
      // Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      // Set display name
      await updateProfile(userCred.user, { displayName: name });

      // Send Firebase verification email
      await sendEmailVerification(userCred.user);

      // Save signup info for the next page
      localStorage.setItem("signupData", JSON.stringify({ name, email }));

      // Go to verification page
      router.push("/verification");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed.");
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

      <form onSubmit={handleSignup} style={{
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
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
          <a href="/login" style={{ color: "white", opacity: 0.85 }}>Already have an account?</a>
        </div>
      </form>
    </div>
  );
}
