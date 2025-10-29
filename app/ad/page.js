"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdPage() {
  const router = useRouter();
  const [explanations, setExplanations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load user's answered questions and their explanations
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const questions = JSON.parse(stored);
        const takenExplanations = questions
          .map((q) => q.explanation)
          .filter(Boolean);
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

  // Redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          const score = data.filter((q) => q.isCorrect).length;
          const total = data.length;
          const topic = data[0]?.topic || "Unknown Topic";
          router.push(
            `/results?score=${score}&total=${total}&topic=${encodeURIComponent(topic)}`
          );
        } catch {
          router.push("/results");
        }
      } else {
        router.push("/results");
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  const currentFact =
    explanations.length > 0
      ? explanations[currentIndex]
      : "Reviewing your answers helps solidify learning!";

  // ✅ Add Ezoic ad loading logic
  useEffect(() => {
    if (typeof window !== "undefined" && window.ezstandalone) {
      window.ezstandalone.cmd = window.ezstandalone.cmd || [];
      window.ezstandalone.cmd.push(function () {
        window.ezstandalone.showAds(101); // Replace 101 with your real Ezoic placement ID
      });
    }
  }, []);

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
      <h2 style={{ color: "#1976d2", marginBottom: "16px" }}>Learning Recap</h2>

      <p
        key={currentIndex}
        style={{
          fontSize: "1.1rem",
          marginBottom: "20px",
          maxWidth: "500px",
          minHeight: "60px",
          transition: "opacity 0.5s ease-in-out",
          color: "#000",
        }}
      >
        {currentFact}
      </p>

      {/* ✅ Ezoic Ad Placeholder (center ad) */}
      <div id="ezoic-pub-ad-placeholder-101" />

      <p style={{ color: "#666", marginTop: "12px" }}>
        Your results will appear shortly...
      </p>
    </div>
  );
}
