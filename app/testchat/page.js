"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TestChat() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const savedTest = sessionStorage.getItem("generatedTest");
    if (savedTest) {
      const parsed = JSON.parse(savedTest);
      setQuestions(parsed);
      setLoading(false);
    } else {
      router.push("/test");
    }
  }, [router]);

  if (loading) {
    return (
      <div style={styles.loadingScreen}>Loading test...</div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);

    const isCorrect = answer === currentQuestion.correctAnswer;
    const pastFacts = JSON.parse(sessionStorage.getItem("pastFacts") || "[]");

    pastFacts.push({
      question: currentQuestion.question,
      explanation: currentQuestion.explanation,
    });

    sessionStorage.setItem("pastFacts", JSON.stringify(pastFacts));

    if (isCorrect) {
      setScore((prev) => prev + 1);
      sessionStorage.setItem("resumeScore", score + 1);
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
      <h1 style={styles.title}>{currentQuestion.topic}</h1>

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
  },
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2rem",
    color: "#1565c0",
    marginBottom: "20px",
  },
  questionBox: {
    background: "#f9f9f9",
    borderRadius: "12px",
    padding: "20px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  questionText: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  answers: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  answerButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "0.3s",
  },
};
