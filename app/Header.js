"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "./firebase"; // adjust path if needed
import { onAuthStateChanged } from "firebase/auth";

const allowedHeaderPaths = ["/", "/progress", "/profile", "/testsetup", "/data"];

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const show = allowedHeaderPaths.includes(path);

  const [user, setUser] = useState(null);

  // Listen for Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!show) return null;

  const handleProtectedRoute = (href) => {
    if (!user) {
      router.push("/signuplogin");
    } else {
      router.push(href);
    }
  };

  return (
    <header
      style={{
        width: "100%",
        padding: "14px 40px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontWeight: "800",
          fontSize: "1.25rem",
          letterSpacing: "0.8px",
          textTransform: "uppercase",
        }}
      >
        thetestifyai
      </span>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
          fontSize: "0.95rem",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
        }}
      >
        <Link href="/" style={{ color: "#333" }}>Home</Link>
        <Link href="/testsetup" style={{ color: "#333" }}>Test Me</Link>

        <span style={{ color: "#333", cursor: "pointer" }} onClick={() => handleProtectedRoute("/data")}>
          Data
        </span>

        <span style={{ color: "#333", cursor: "pointer" }} onClick={() => handleProtectedRoute("/progress")}>
          Progress
        </span>

        <span style={{ color: "#333", cursor: "pointer" }} onClick={() => handleProtectedRoute("/profile")}>
          Profile
        </span>
      </nav>
    </header>
  );
}
