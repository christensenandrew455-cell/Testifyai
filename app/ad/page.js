"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdPage() {
  const router = useRouter();
  const [factIndex, setFactIndex] = useState(0);
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load past test facts
  useEffect(() => {
    const storedFacts = JSON.parse(localStorage.getItem("pastFacts")) || [];
    setFacts(storedFacts.length ? storedFacts : ["Learning makes you smarter!"]);
    setLoading(false);
  }, []);

  // Cycle through facts every 2.5s then go to results
  useEffect(() => {
    if (facts.length === 0) return;
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 2500);

    const timeout = setTimeout(() => {
      router.push("/results");
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [facts, router]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#1976d2",
          fontSize: "1.5rem",
        }}
      >
        Loading ad...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #ffffff, #e3f2fd)",
        color: "#222",
        textAlign: "center",
        padding: "40px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          color: "#1976d2",
          fontWeight: "800",
          marginBottom: "20px",
        }}
      >
        Sponsored Learning Break
      </h1>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px 30px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        <h2
          style={{
            color: "#1976d2",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          Fun Fact
        </h2>
        <p
          style={{
            color: "#333",
            fontSize: "1.2rem",
            minHeight: "80px",
            transition: "opacity 0.5s ease",
          }}
        >
          {facts[factIndex]}
        </p>
      </div>

      <p style={{ marginTop: "30px", color: "#777", fontSize: "0.9rem" }}>
        Your results will appear shortly...
      </p>
    </div>
  );
}
