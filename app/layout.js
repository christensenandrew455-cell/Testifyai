// app/layout.js
import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TestifyAI",
  description: "For all your testing needs — powered by AI precision.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google AdSense verification meta tag */}
        <meta
          name="google-adsense-account"
          content="ca-pub-9836120352832422"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
