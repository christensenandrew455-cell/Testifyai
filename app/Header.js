"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const allowedHeaderPaths = ["/", "/progress", "/profile", "/testsetup", "/data"];

// Check login status
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

  // Sync login status on mount + whenever localStorage changes
  useEffect(() => {
    setLoggedIn(isLoggedIn());

    function syncLoginState() {
      setLoggedIn(isLoggedIn());
    }

    window.addEventListener("storage", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
    };
  }, []);

  if (!show) return null;

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
      {/* LEFT: LOGO */}
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

      {/* RIGHT: NAVIGATION */}
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
