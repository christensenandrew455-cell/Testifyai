"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdPage() {
  const router = useRouter();
  const [explanations, setExplanations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Load explanations
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
      console.error("Error loading testData:", err);
    }
  }, []);

  // ✅ Rotate facts every 2.5s
  useEffect(() => {
    if (explanations.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % explanations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [explanations]);

  // ✅ Redirect after 10s
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

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "32px 40px",
          maxWidth: "600px",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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

        <p style={{ color: "#666" }}>Your results will appear shortly...</p>
      </div>
    </div>
  );
}
