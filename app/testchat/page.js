"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TestChat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Test";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  // ✅ Load test data from session
  useEffect(() => {
    const saved = sessionStorage.getItem("testData");
    const resumeIndex = Number(sessionStorage.getItem("resumeIndex") || "0");
    const resumeScore = Number(sessionStorage.getItem("resumeScore") || "0");

    if (!saved) {
      router.push("/test");
      return;
    }

    const parsed = JSON.parse(saved);
    setQuestions(parsed);
    setCurrentIndex(resumeIndex);
    setScore(resumeScore);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={styles.loadingScreen}>Loading test...</div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.correctAnswer;

    // ✅ Save explanation & question for Learn page
    const pastFacts = JSON.parse(sessionStorage.getItem("pastFacts") || "[]");
    pastFacts.push({
      question: currentQuestion.question,
      explanation: currentQuestion.explanation,
    });
    sessionStorage.setItem("pastFacts", JSON.stringify(pastFacts));

    // ✅ Update score
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    sessionStorage.setItem("resumeScore", newScore);

    // ✅ Save index progress
    sessionStorage.setItem("resumeIndex", currentIndex + 1);

    // ✅ Go to next route
    if (isCorrect) {
      router.push(
        `/correct?index=${currentIndex}&total=${questions.length}`
      );
    } else {
      router.push(
        `/incorrect?index=${currentIndex}&total=${questions.length}`
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{topic}</h1>

      <div style={styles.progress}>
        Question {currentIndex + 1} / {questions.length} | Score: {score}
      </div>

      <div style={styles.questionBox}>
        <p style={styles.questionText}>{currentQuestion.question}</p>

        <div style={styles.answers}>
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              style={styles.answerButton}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  loadingScreen: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.3rem",
    color: "#333",
  },
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "Segoe UI, Roboto, sans-serif",
  },
  title: {
    fontSize: "2.2rem",
    color: "#1976d2",
    fontWeight: 800,
    marginBottom: "20px",
  },
  progress: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "20px",
  },
  questionBox: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  questionText: {
    fontSize: "1.3rem",
    fontWeight: 600,
    marginBottom: "20px",
    color: "#222",
  },
  answers: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  answerButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "0.3s",
  },
};
