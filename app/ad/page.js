"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdPage() {
  const router = useRouter();
  const [explanations, setExplanations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load the user's answered questions and their explanations
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const questions = JSON.parse(stored);
        // Collect all explanations from the questions already taken
        const takenExplanations = questions
          .map((q) => q.explanation)
          .filter(Boolean);
        // Shuffle them for randomness
        const shuffled = takenExplanations.sort(() => Math.random() - 0.5);
        setExplanations(shuffled);
      }
    } catch (err) {
      console.error("Error loading explanations:", err);
    }
  }, []);

  // Cycle through explanations every 2.5 seconds
  useEffect(() => {
    if (explanations.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % explanations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [explanations]);

  // Load AdSense and redirect after 10 seconds
  useEffect(() => {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense load error:", e);
    }

    const timer = setTimeout(() => {
      router.push("/results");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const currentFact =
    explanations.length > 0
      ? explanations[currentIndex]
      : "Reviewing your answers helps solidify learning!";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#1976d2", marginBottom: "16px" }}>
        Learning Recap
      </h2>

      <p
        key={currentIndex}
        style={{
          fontSize: "1.1rem",
          marginBottom: "20px",
          maxWidth: "500px",
          minHeight: "60px",
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {currentFact}
      </p>

      {/* Google AdSense Ad Slot */}
      <div
        style={{
          width: "320px",
          height: "100px",
          backgroundColor: "#eee",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: "10px",
        }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXX" // ← your AdSense ID
          data-ad-slot="1234567890" // ← your ad slot ID
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>

      <p style={{ color: "#666" }}>Your results will appear shortly...</p>
    </div>
  );
}
