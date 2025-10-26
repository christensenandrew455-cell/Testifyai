"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function TestChatInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topic = searchParams.get("topic") || "Unknown Topic";
  const difficulty = searchParams.get("difficulty") || "1";
  const questionCount = searchParams.get("questionCount") || "5";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/generate-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            difficulty,
            numQuestions: Number(questionCount),
          }),
        });

        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
        } else {
          console.error("Invalid test data:", data);
        }
      } catch (err) {
        console.error("Error generating test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [topic, difficulty, questionCount]);

  const currentQuestion = questions[currentIndex];

  const handleCheckAnswer = () => {
    if (selected === null) {
      alert("Please select an answer first!");
      return;
    }

    const correctAnswer = currentQuestion.correct;
    const selectedAnswer = currentQuestion.answers[selected];

    if (selectedAnswer === correctAnswer) {
      router.push(
        `/correct?current=${currentIndex}&total=${questions.length}`
      );
    } else {
      router.push(
        `/incorrect?current=${currentIndex}&total=${questions.length}`
      );
    }
  };

  if (loading) {
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
        Generating your test...
      </div>
    );
  }

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
        No questions available.
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

        {/* Topic Title (Blue) */}
        <h2
          style={{
            fontWeight: 800,
            fontSize: "1.3rem",
            color: "#1976d2",
            textAlign: "center",
            flex: 1,
          }}
        >
          {topic}
        </h2>

        {/* App Title */}
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
