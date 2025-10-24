"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const total = searchParams.get("total");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/results?score=${score}&total=${total}`);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, [router, score, total]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-gray-900 text-center p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Sponsored Message</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your results are almost ready! Please enjoy this brief message...
      </p>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-11/12 sm:w-2/3 lg:w-1/2">
        <p className="text-gray-600">
          [Ad space — you can place an image, video, or partner message here]
        </p>
      </div>
      <p className="mt-6 text-sm text-gray-500">(You’ll be redirected automatically)</p>
    </div>
  );
}
