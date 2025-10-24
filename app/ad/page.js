"use client";

export const dynamic = "force-dynamic";

import Script from "next/script";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect to results page after 5 seconds
    const timeout = setTimeout(() => {
      const score = searchParams.get("score");
      const total = searchParams.get("total");
      router.push(`/results?score=${score}&total=${total}`);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 text-center p-6">
      {/* Load AdSense library safely */}
      <Script
        id="adsbygoogle-init"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9836120352832422"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <h1 className="text-3xl font-bold text-blue-700 mb-4">Advertisement</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your results will appear after this short ad.
      </p>

      {/* Actual ad unit */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9836120352832422"
        data-ad-slot="1234567890"  // 👈 replace this with your real Ad Slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      {/* Initialize the ad */}
      <Script id="adsbygoogle-load">{`
        (adsbygoogle = window.adsbygoogle || []).push({});
      `}</Script>
    </div>
  );
}
