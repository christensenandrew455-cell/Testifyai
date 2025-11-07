"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function TestChatInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Unknown Topic";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [adIndexes, setAdIndexes] = useState([]);

  // Load test data, shuffle answers per question, compute adIndexes
  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const parsed = JSON.parse(stored).map((q) => {
        const answers = [...q.answers];
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }

        let correctIndex = q.correct;
        if (typeof correctIndex === "string" && /^[A-D]$/i.test(correctIndex)) {
          correctIndex = correctIndex.toUpperCase().charCodeAt(0) - 65;
        }
        const correctAnswerText = q.answers[correctIndex];
        const shuffledCorrectIndex = answers.indexOf(correctAnswerText);

        return {
          ...q,
          answers,
          shuffledCorrectIndex,
        };
      });

      setQuestions(parsed);
      sessionStorage.setItem("testData", JSON.stringify(parsed));

      if (!sessionStorage.getItem("adIndexes")) {
        const total = parsed.length;
        const eligible = Array.from({ length: total - 11 }, (_, i) => i + 10).slice(
          0,
          total - 1 - 10
        );
        const numAds = Math.floor(total / 15);
        const adSlots = [];

        if (eligible.length > 0 && numAds > 0) {
          for (let i = 0; i < numAds; i++) {
            const segment = Math.floor(eligible.length / numAds);
            const start = i * segment;
            const end = i === numAds - 1 ? eligible.length : (i + 1) * segment;
            const segmentSlots = eligible.slice(start, end);
            const pick =
              segmentSlots[Math.floor(Math.random() * segmentSlots.length)];
            adSlots.push(pick);
          }
        }

        sessionStorage.setItem("adIndexes", adSlots.join(","));
        setAdIndexes(adSlots);
      } else {
        setAdIndexes(sessionStorage.getItem("adIndexes").split(",").map(Number));
      }
    }
  }, []);

  // Resume previous index
  useEffect(() => {
    const resumeIndex = sessionStorage.getItem("resumeIndex");
    if (resumeIndex) {
      setCurrentIndex(parseInt(resumeIndex));
      sessionStorage.removeItem("resumeIndex");
    }
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleCheckAnswer = () => {
    if (!currentQuestion || selected === null) return;

    const isCorrect = selected === currentQuestion.shuffledCorrectIndex;
    const userAnswer = currentQuestion.answers[selected];
    const correctAnswerText =
      currentQuestion.answers[currentQuestion.shuffledCorrectIndex];

    try {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        if (data[currentIndex]) {
          data[currentIndex].userAnswer = userAnswer;
          data[currentIndex].isCorrect = isCorrect;
        }
        sessionStorage.setItem("testData", JSON.stringify(data));
      }
      sessionStorage.setItem("topic", topic);
    } catch (err) {
      console.error("Error saving answer:", err);
    }

    const query = new URLSearchParams({
      question: currentQuestion.question,
      userAnswer,
      correctAnswer: correctAnswerText,
      explanation: currentQuestion.explanation || "",
      index: currentIndex.toString(),
      topic,
    }).toString();

    router.push(isCorrect ? `/correct?${query}` : `/incorrect?${query}`);
  };

  // ✅ Fixed ad script injection (safe single-load + cleanup)
  useEffect(() => {
    if (adIndexes.includes(currentIndex)) {
      let script = document.querySelector("script[data-zone='10137448']");
      if (!script) {
        script = document.createElement("script");
        script.dataset.zone = "10137448";
        script.src = "https://groleegni.net/vignette.min.js";
        document.body.appendChild(script);
      }
    }

    return () => {
      // optional cleanup (prevents duplication if page is remounted)
      const script = document.querySelector("script[data-zone='10137448']");
      if (script) script.remove();
    };
  }, [currentIndex, adIndexes]);

  useEffect(() => {
    sessionStorage.setItem("resumeIndex", currentIndex);
  }, [currentIndex]);

  if (!currentQuestion) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          color: "#333",
        }}
      >
        Loading test...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        color: "#222",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "800px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "8px 20px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Leave
        </button>

        <h2
          style={{
            fontWeight: 800,
            fontSize: "1.3rem",
            color: "#1976d2",
          }}
        >
          {topic}
        </h2>

        <div style={{ fontWeight: 700, color: "#1976d2" }}>TheTestifyAI</div>
      </div>

      <div
        style={{
          border: "3px solid #1976d2",
          borderRadius: "16px",
          backgroundColor: "white",
          width: "100%",
          maxWidth: "700px",
          padding: "24px",
          fontSize: "1.1rem",
          fontWeight: 500,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        {currentQuestion.question}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "24px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {currentQuestion.answers.map((ans, i) => {
          const letter = String.fromCharCode(65 + i);
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "10px",
                padding: "10px 16px",
                borderRadius: "12px",
                border:
                  selected === i
                    ? "3px solid #1976d2"
                    : "2px solid rgba(0,0,0,0.1)",
                backgroundColor:
                  selected === i ? "rgba(25,118,210,0.1)" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  height: "16px",
                  width: "16px",
                  borderRadius: "50%",
                  border:
                    selected === i
                      ? "6px solid #1976d2"
                      : "2px solid rgba(0,0,0,0.3)",
                }}
              ></div>
              <strong>{letter}.</strong> {ans}
            </button>
          );
        })}
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <div style={{ fontWeight: 600 }}>
          Question {currentIndex + 1} of {questions.length}
        </div>

        <button
          onClick={handleCheckAnswer}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Check Answer
        </button>
      </div>
    </div>
  );
}

export default function TestChatPage() {
  return (
    <Suspense fallback={<div>Loading test...</div>}>
      <TestChatInner />
    </Suspense>
  );
}
