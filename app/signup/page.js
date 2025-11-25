"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");

  async function handleSignup() {
    setError("");

    if (pass !== pass2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      // Update display name
      await updateProfile(userCred.user, {
        displayName: name,
      });

      router.push("/profile"); // redirect after signup
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ /* your same styling */ }}>
      {/* stuff removed for clarity */}

      {error && (
        <p style={{ color: "red", marginBottom: "12px", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        style={{ /* input style */ }}
      />

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

      <input
        type="password"
        placeholder="Re-enter Password"
        onChange={(e) => setPass2(e.target.value)}
        style={{ /* input style */ }}
      />

      <button
        onClick={handleSignup}
        style={{ /* button style */ }}
      >
        Create Account
      </button>

      <Link href="/login">Already have an account?</Link>
    </div>
  );
}
