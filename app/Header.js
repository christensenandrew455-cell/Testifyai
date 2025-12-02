"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const allowedHeaderPaths = ["/", "/progress", "/profile", "/testsetup", "/data"];

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const show = allowedHeaderPaths.includes(path);

  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!show) return null;

  const handleProtectedRoute = (href) => {
    if (!user) {
      setShowLoginModal(true); // 🔥 OPEN MODAL INSTEAD OF REDIRECTING
      return;
    }

    if (href === "/data") {
      alert("⚠️ Page Under Construction");
      return;
    }

    router.push(href);
  };

  return (
    <>
      {/* HEADER */}
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
        {/* LOGO (Hidden on mobile) */}
        <span
          className="logo-text"
          style={{
            fontWeight: "800",
            fontSize: "1.25rem",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          thetestifyai
        </span>

        {/* Responsive CSS */}
        <style>
          {`
            @media (max-width: 768px) {
              .logo-text {
                display: none !important;
              }
            }
          `}
        </style>

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

      {/* 🔥 LOGIN MODAL */}
      {showLoginModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "40px",
              padding: "50px 40px",
              width: "95%",
              maxWidth: "540px",
              color: "black",
              fontFamily: "Segoe UI, Roboto, sans-serif",
              textAlign: "center",
              position: "relative",
              boxShadow: "0 10px 26px rgba(0,0,0,0.28)",
              border: "3px solid rgba(0,0,0,0.06)",
            }}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: "absolute",
                top: "18px",
                right: "22px",
                background: "rgba(0,0,0,0.05)",
                border: "2px solid rgba(0,0,0,0.15)",
                backdropFilter: "blur(4px)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                fontSize: "1.2rem",
                fontWeight: 700,
                cursor: "pointer",
                color: "black",
              }}
            >
              ✕
            </button>

            <h2
              style={{
                marginBottom: "10px",
                fontWeight: 800,
                fontSize: "1.6rem",
                color: "black",
              }}
            >
              Sign In Required
            </h2>

            <p
              style={{
                marginBottom: "30px",
                opacity: 0.85,
                fontSize: "1.05rem",
                lineHeight: "1.45",
                color: "black",
              }}
            >
              To access this feature, you need to be signed in.  
              Create an account or log in below.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                width: "100%",
              }}
            >
              <Link
                href="/signup"
                style={{
                  padding: "16px 0",
                  borderRadius: "12px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Sign Up
              </Link>

              <Link
                href="/login"
                style={{
                  padding: "16px 0",
                  borderRadius: "12px",
                  border: "2px solid rgba(0,0,0,0.2)",
                  backgroundColor: "rgba(0,0,0,0.04)",
                  color: "black",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
