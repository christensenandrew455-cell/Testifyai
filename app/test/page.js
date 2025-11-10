"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const router = useRouter();

  useEffect(() => {
    // Load stored test data (from sessionStorage)
    const data = sessionStorage.getItem("testData");

    if (!data) {
      alert("No test data found — please generate a test first.");
      router.push("/");
      return;
    }

    const parsed = JSON.parse(data);
    const type = parsed.testType || "multiple-choice";

    // Redirect to correct test type view
    router.push(`/test/${type}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-white bg-gradient-to-r from-blue-500 to-orange-400">
      <h2 className="text-xl font-semibold">Loading your test...</h2>
    </div>
  );
}
