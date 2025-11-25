"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const allowedHeaderPaths = [
  "/",
  "/progress",
  "/profile",
  "/testsetup",
  "/results",
  "/data",
];

export default function Header() {
  const path = usePathname();
  const show = allowedHeaderPaths.includes(path);

  if (!show) return null;

  return (
    <header
      style={{
        width: "100%",
        padding: "14px 40px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",  // 👈 spread apart
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
          gap: "28px",        // smaller, cleaner spacing
          fontSize: "0.95rem", // 👈 smaller text
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
        }}
      >
        <Link href="/" style={{ color: "#333" }}>
          Home
        </Link>

        <Link href="/testsetup" style={{ color: "#333" }}>
          Test Me
        </Link>

        <Link href="/data" style={{ color: "#333" }}>
          Data
        </Link>

        <Link href="/progress" style={{ color: "#333" }}>
          Progress
        </Link>

        <Link href="/profile" style={{ color: "#333" }}>
          Profile
        </Link>
      </nav>
    </header>
  );
}
