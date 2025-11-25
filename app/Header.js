"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const allowedHeaderPaths = [
  "/", 
  "/progress", 
  "/profile",  
  "/testsetup", 
  "/results",
  "/data"
];

export default function Header() {
  const path = usePathname();
  const show = allowedHeaderPaths.includes(path);

  if (!show) return null;

  return (
    <header
      style={{
        width: "100%",
        padding: "18px 0",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
        fontSize: "1.15rem",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.7px",
      }}
    >
      <span style={{ fontWeight: "800", marginRight: "80px" }}>
        thetestifyai
      </span>

      <Link href="/" style={{ textDecoration: "none", color: "#333" }}>
        Home
      </Link>

      <Link href="/testsetup" style={{ textDecoration: "none", color: "#333" }}>
        Test Me
      </Link>

      <Link href="/data" style={{ textDecoration: "none", color: "#333" }}>
        Data
      </Link>

      <Link href="/progress" style={{ textDecoration: "none", color: "#333" }}>
        Progress
      </Link>

      <Link href="/profile" style={{ textDecoration: "none", color: "#333" }}>
        Profile
      </Link>
    </header>
  );
}
