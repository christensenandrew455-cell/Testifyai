"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push("/profile"); // redirect after login
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <div style={{ /* your same styling */ }}>
      {error && (
        <p style={{ color: "red", marginBottom: "12px", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ /* input style */ }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPass(e.target.value)}
        style={{ /* input style */ }}
      />

      <button
        onClick={handleLogin}
        style={{ /* button style */ }}
      >
        Log In
      </button>

      <Link href="/signup">Don't have an account?</Link>
    </div>
  );
}
