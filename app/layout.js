// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import Header from "./Header.js";  // <-- ADD THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TestifyAI",
  description: "For all your testing needs — powered by AI precision.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TestifyAI</title>
        <meta name="monetag" content="1a8ae42b7ebcfe6cbe21c25d047bbd48" />
      </head>

      <body className={inter.className} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        
        {/* CLIENT HEADER ALWAYS RENDERS CORRECTLY */}
        <Header />

        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            padding: "16px 0",
            backgroundColor: "#f5f5f5",
            fontSize: "0.9rem",
            color: "#444",
            borderTop: "1px solid #ddd",
          }}
        >
          <Link
            href="/privacy-policy"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Privacy Policy
          </Link>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
