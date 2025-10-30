// app/layout.js
import "./globals.css";
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

      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-grow">{children}</main>

        {/* ✅ Simple Footer */}
        <footer className="border-t mt-10 py-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} TestifyAI. All rights reserved.
          </p>
          <p className="mt-2">
            <a
              href="/privacy-policy"
              className="text-blue-600 hover:text-blue-800"
            >
              Privacy Policy
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
