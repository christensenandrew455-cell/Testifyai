"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdPage() {
  const router = useRouter();
  const [facts, setFacts] = useState([]);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("pastFacts") || "[]");
    const score = parseInt(sessionStorage.getItem("resumeScore")) || 0;
    const total = parseInt(sessionStorage.getItem("resumeTotal")) || stored.length;

    if (stored.length === 0) {
      router.push("/results?score=" + score + "&total=" + total);
      return;
    }

    // Shuffle facts and take first 5
    const shuffled = stored.sort(() => 0.5 - Math.random()).slice(0, 5);
    setFacts(shuffled);

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < shuffled.length) {
        setCurrentFactIndex(index);
      } else {
        clearInterval(interval);
        router.push(`/results?score=${score}&total=${total}`);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [router]);

  if (facts.length === 0)
    return (
      <div style={styles.loading}>Loading your fun facts...</div>
    );

  const fact = facts[currentFactIndex];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Fun Fact 💡</h1>
      <p style={styles.factText}>{fact.explanation}</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(90deg, #2196f3, #ff9800)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#fff",
    padding: "40px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  factText: {
    fontSize: "1.2rem",
    maxWidth: "600px",
    lineHeight: "1.6",
  },
  loading: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
  },
};
