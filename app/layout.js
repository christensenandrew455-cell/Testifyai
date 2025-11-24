// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TestifyAI",
  description: "For all your testing needs — powered by AI precision.",
};

// 👇 Pages where the header should be visible
const allowedHeaderPaths = [
  "/", 
  "/progress", 
  "/profile",  
  "/testsetup", 
  "/results"
];

export default function RootLayout({ children }) {
  // Detect current path at runtime
  const path =
    typeof window !== "undefined" ? window.location.pathname : "";

  const showHeader = allowedHeaderPaths.includes(path);

  return (
    <html lang="en">
      <head>
        <title>TestifyAI</title>
        <meta name="monetag" content="1a8ae42b7ebcfe6cbe21c25d047bbd48" />
      </head>

      <body className={inter.className}>
        
        {/* Show header ONLY on selected pages */}
        {showHeader && (
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

            <Link href="/test" style={{ textDecoration: "none", color: "#333" }}>
              Test Me
            </Link>

            <Link href="/progress" style={{ textDecoration: "none", color: "#333" }}>
              Progress
            </Link>

            <Link href="/profile" style={{ textDecoration: "none", color: "#333" }}>
              Profile
            </Link>
          </header>
        )}

        {/* Page content */}
        <div style={{ minHeight: "80vh" }}>{children}</div>

        <Analytics />
      </body>
    </html>
  );
}
