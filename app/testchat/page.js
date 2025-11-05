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

  useEffect(() => {
    const stored = sessionStorage.getItem("testData");
    if (stored) {
      const parsed = JSON.parse(stored).map(q => ({ ...q, topic }));
      setQuestions(parsed);
      sessionStorage.setItem("testData", JSON.stringify(parsed));
    }
  }, []);

  const currentQuestion = questions[currentIndex];

  // ✅ Ad logic (1 ad per 15 questions, never before question 10 or on last question)
  useEffect(() => {
    if (
      questions.length > 0 &&
      currentIndex + 1 > 10 && // no ads before 10
      (currentIndex + 1) % 15 === 0 && // one ad every 15
      currentIndex + 1 < questions.length // not on last
    ) {
      const existingAd = document.querySelector("script[data-zone='10137448']");
      if (!existingAd) {
        const script = document.createElement("script");
        script.dataset.zone = "10137448";
        script.src = "https://groleegni.net/vignette.min.js";
        document.body.appendChild(script);
      }
    }
  }, [currentIndex, questions.length]);

  const handleCheckAnswer = () => {
    if (!currentQuestion || selected === null) return;

    const userAnswer = currentQuestion.answers[selected];

    // ✅ Resolve full correct answer text even if letter
    let correctAnswerText = currentQuestion.correct;
    if (
      typeof currentQuestion.correct === "string" &&
      currentQuestion.correct.length === 1 &&
      /^[A-D]$/i.test(currentQuestion.correct)
    ) {
      const letterIndex = currentQuestion.correct.toUpperCase().charCodeAt(0) - 65;
      correctAnswerText = currentQuestion.answers[letterIndex] || currentQuestion.correct;
    }

    const isCorrect = userAnswer === correctAnswerText;

    // Save progress
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

    // Go to result screen
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

  useEffect(() => {
    const resumeIndex = sessionStorage.getItem("resumeIndex");
    if (resumeIndex) {
      setCurrentIndex(parseInt(resumeIndex));
      sessionStorage.removeItem("resumeIndex");
    }
  }, []);

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
          onClick={() => router.push("/test")}
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
        {currentQuestion.answers.map((ans, i) => (
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
            {ans}
          </button>
        ))}
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
