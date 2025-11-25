"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const allowedHeaderPaths = [
  "/", 
  "/progress", 
  "/profile",  
  "/testsetup", 
  "/data"
];

// Your login checker — change it to match your auth system
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

  // Protected links — only allowed if logged in
  const ProtectedLink = ({ href, label }) => (
    <span
      onClick={() => {
        if (!loggedIn) {
          router.push("/signin"); // redirect if NOT logged in
        } else {
          router.push(href);
        }
      }}
      style={{
        cursor: "pointer",
        color: "#333",
        textDecoration: "none",
        fontSize: "1.05rem",
        marginLeft: "22px"
      }}
    >
      {label}
    </span>
  );

  // Public links — always allowed
  const PublicLink = ({ href, label }) => (
    <span
      onClick={() => router.push(href)}
      style={{
        cursor: "pointer",
        color: "#333",
        textDecoration: "none",
        fontSize: "1.05rem",
        marginLeft: "22px"
      }}
    >
      {label}
    </span>
  );

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
        gap: "60px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.7px",
      }}
    >
      <span
        style={{
          fontWeight: "800",
          marginRight: "120px",
          fontSize: "1.25rem",
          cursor: "pointer"
        }}
        onClick={() => router.push("/")}
      >
        thetestifyai
      </span>

      {/* Public */}
      <PublicLink href="/" label="Home" />
      <PublicLink href="/testsetup" label="Test Me" />

      {/* Protected */}
      <ProtectedLink href="/data" label="Data" />
      <ProtectedLink href="/progress" label="Progress" />
      <ProtectedLink href="/profile" label="Profile" />
    </header>
  );
}
