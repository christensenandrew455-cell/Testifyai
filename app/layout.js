import "./global.css"; 

export const metadata = {
  title: "TestifyAI",
  description: "AI-powered adaptive testing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
