"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

function AdContent() {
  const params = useSearchParams();
  const score = params.get("score");
  const total = params.get("total");
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanContinue(true), 5000); // 5s delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9836120352832422"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-800">Advertisement</h1>

      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-9836120352832422"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <Script id="ads-init" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>

      {canContinue && (
        <Link
          href={`/results?score=${score}&total=${total}`}
          className="mt-6 bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition"
        >
          Continue to Results →
        </Link>
      )}
    </div>
  );
}

export default function AdPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading ad…</div>}>
      <AdContent />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
