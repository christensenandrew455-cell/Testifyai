"use client";

// ✅ These tell Next.js: don't prerender or cache this page
export const dynamic = "force-dynamic";
export const revalidate = false;
export const fetchCache = "force-no-store";

import Script from "next/script";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const score = searchParams.get("score");
      const total = searchParams.get("total");
      router.push(`/results?score=${score}&total=${total}`);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 text-center p-6">
      {/* ✅ Google AdSense script */}
      <Script
        id="adsense-init"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9836120352832422"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <h1 className="text-3xl font-bold text-blue-700 mb-4">Advertisement</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your results will appear after this short ad.
      </p>

      {/* ✅ Ad container */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9836120352832422"
        data-ad-slot="1234567890"  // replace with your AdSense slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <Script id="adsense-load">{`
        (adsbygoogle = window.adsbygoogle || []).push({});
      `}</Script>
    </div>
  );
}
