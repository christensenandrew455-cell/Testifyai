"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CorrectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const index = Number(searchParams.get("index")) || 0;
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanContinue(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (!canContinue) return;

    let total = 0;
    try {
      const stored = sessionStorage.getItem("testData");
      total = JSON.parse(stored).questions.length;
    } catch {}

    const nextIndex = index + 1;

    if (nextIndex >= total) {
      router.push("/ad");
      return;
    }

    sessionStorage.setItem("currentIndex", String(nextIndex));
    router.push("/test/controller");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-green-500 mb-6">Correct!</h1>
      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className={`mt-4 px-6 py-3 rounded-xl text-white text-lg transition-transform
          ${canContinue ? "bg-blue-600 active:scale-95" : "bg-gray-500 cursor-not-allowed"}`}
      >
        Continue
      </button>
    </div>
  );
}
