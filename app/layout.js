// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TestifyAI",
  description: "For all your testing needs — powered by AI precision.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Ezoic Privacy Scripts (must load first) */}
        <script
          src="https://cmp.gatekeeperconsent.com/min.js"
          data-cfasync="false"
        ></script>
        <script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          data-cfasync="false"
        ></script>

        {/* ✅ Ezoic Header Script */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />
      </head>

      <body
        className={`${inter.className}`}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>

        {/* ✅ Footer Section */}
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
      </body>
    </html>
  );
}
