import "./global.css";

export const metadata = {
  title: "TheTestifyAI",
  description: "AI-powered adaptive testing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-orange-50 text-gray-900 min-h-screen flex flex-col items-center justify-center text-center">
        {children}
      </body>
    </html>
  );
}
