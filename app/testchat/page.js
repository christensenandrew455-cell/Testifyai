"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function TestChatInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Unknown Topic";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    // TEMP MOCK DATA
    setQuestions([
      {
        question: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
      },
      {
        question: "Which planet is known as the Red Planet?",
        answers: ["Earth", "Mars", "Jupiter", "Venus"],
        correct: 1,
      },
    ]);
  }, []);

  const currentQuestion = questions[currentIndex];

  const checkAnswer = () => {
    if (selected === null) return;
    setFeedback(
      selected === currentQuestion.correct ? "✅ Correct!" : "❌ Incorrect"
    );
    setShowNext(false);
    setTimeout(() => setShowNext(true), 2000);
  };

  const nextQuestion = () => {
    setFeedback("");
    setSelected(null);
    setShowNext(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("✅ Test completed!");
      router.push("/test");
    }
  };

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
      {/* HEADER */}
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

        <h2 style={{ fontWeight: 800, fontSize: "1.3rem" }}>{topic}</h2>

        <div style={{ fontWeight: 700, color: "#1976d2" }}>TheTestifyAI</div>
      </div>

      {/* QUESTION BOX */}
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

      {/* ANSWERS */}
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
            disabled={!!feedback}
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
              cursor: feedback ? "default" : "pointer",
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

      {/* BOTTOM BAR */}
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

        {!feedback && (
          <button
            onClick={checkAnswer}
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
        )}

        {showNext && (
          <button
            onClick={nextQuestion}
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
            Next Question
          </button>
        )}
      </div>

      {/* FEEDBACK OVERLAY */}
      {feedback && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            backgroundColor: "rgba(255,255,255,0.95)",
            border: "2px solid #1976d2",
            borderRadius: "12px",
            padding: "14px 28px",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#1976d2",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            opacity: feedback ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {feedback}
        </div>
      )}
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
