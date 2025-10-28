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

  const handleCheckAnswer = () => {
    if (!currentQuestion || selected === null) return;
    const userAnswer = currentQuestion.answers[selected];
    const isCorrect = userAnswer === currentQuestion.correct;

    // ✅ Save user's answer + correctness into sessionStorage
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

      // ✅ Also store topic so other pages can use it
      sessionStorage.setItem("topic", topic);
    } catch (err) {
      console.error("Error saving answer:", err);
    }

    // ✅ Include topic in query params so /correct & /incorrect pages get it
    const query = new URLSearchParams({
      question: currentQuestion.question,
      userAnswer,
      correctAnswer: currentQuestion.correct,
      explanation: currentQuestion.explanation || "",
      index: currentIndex.toString(),
      topic, // 👈 FIX ADDED HERE
    }).toString();

    router.push(isCorrect ? `/correct?${query}` : `/incorrect?${query}`);
  };

  // Move to next question (used by correct/incorrect)
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push("/ad"); // ✅ after final question
    }
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
