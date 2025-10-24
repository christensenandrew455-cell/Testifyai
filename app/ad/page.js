"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

function AdContent() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* ✅ Google AdSense script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9836120352832422"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-800">Advertisement</h1>

      {/* Example Ad container */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-9836120352832422"
        data-ad-slot="1234567890"   // Replace this with your real AdSense slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <Script id="ads-init" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>

      {id && (
        <p className="mt-6 text-gray-600">
          Showing ad for query ID: <strong>{id}</strong>
        </p>
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

// Prevent static rendering to avoid prerender errors
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
