"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const allowedHeaderPaths = [
  "/",
  "/progress",
  "/profile",
  "/testsetup",
  "/data",
];

// Simple login check (change this later to match your auth)
function isLoggedIn() {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("authToken");
  }
  return false;
}

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const show = allowedHeaderPaths.includes(path);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  if (!show) return null;

  // Protect certain links (data, progress, profile)
  const handleProtectedRoute = (href) => {
    if (!loggedIn) {
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
      {/* LEFT SIDE: LOGO */}
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

      {/* RIGHT SIDE: NAVIGATION LINKS */}
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
        {/* Always allowed */}
        <Link href="/" style={{ color: "#333" }}>
          Home
        </Link>

        <Link href="/testsetup" style={{ color: "#333" }}>
          Test Me
        </Link>

        {/* PROTECTED LINKS */}
        <span
          style={{ color: "#333", cursor: "pointer" }}
          onClick={() => handleProtectedRoute("/data")}
        >
          Data
        </span>

        <span
          style={{ color: "#333", cursor: "pointer" }}
          onClick={() => handleProtectedRoute("/progress")}
        >
          Progress
        </span>

        <span
          style={{ color: "#333", cursor: "pointer" }}
          onClick={() => handleProtectedRoute("/profile")}
        >
          Profile
        </span>
      </nav>
    </header>
  );
}
