"use client";
import { useEffect, useState } from "react";

export default function MultipleChoice({ question, onAnswer }) {
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  // Handle missing or invalid question data
  if (!question || !question.answers || !Array.isArray(question.answers)) {
    return <p>Loading question...</p>;
  }

  // Shuffle answers once when question changes
  useEffect(() => {
    const shuffled = [...question.answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAnswers(shuffled);
    setSelected(null);
  }, [question]);

  // Send selected answer to parent
  useEffect(() => {
    if (selected !== null && onAnswer) {
      onAnswer({
        selected: answers[selected],
        correct: question.correct,
        explanation: question.explanation,
      });
    }
  }, [selected]);

  return (
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
      <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
        {question.question}
      </h2>

      {answers.map((ans, i) => {
        const letter = String.fromCharCode(65 + i);
        const isSelected = selected === i;
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
              border: isSelected
                ? "3px solid #1976d2"
                : "2px solid rgba(0,0,0,0.1)",
              backgroundColor: isSelected
                ? "rgba(25,118,210,0.1)"
                : "white",
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
                border: isSelected
                  ? "6px solid #1976d2"
                  : "2px solid rgba(0,0,0,0.3)",
              }}
            ></div>
            <strong>{letter}.</strong> {ans}
          </button>
        );
      })}
    </div>
  );
}
