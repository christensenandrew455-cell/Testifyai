import "./global.css";

export const metadata = {
  title: "TestifyAI",
  description: "AI-powered adaptive testing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-orange-50 text-gray-900 flex flex-col min-h-screen">
        <main className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 md:px-10">
          <div className="w-full max-w-2xl text-center">{children}</div>
        </main>
      </body>
    </html>
  );
}
