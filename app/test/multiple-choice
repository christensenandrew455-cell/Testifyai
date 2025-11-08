"use client";
import { useEffect, useState } from "react";

export default function MultipleChoice({ question, onAnswer }) {
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  // Shuffle answers once when question changes
  useEffect(() => {
    if (!question) return;
    const shuffled = [...question.answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAnswers(shuffled);
    setSelected(null);
  }, [question]);

  // Notify parent when a choice is made (optional hook for later)
  useEffect(() => {
    if (selected !== null && onAnswer) {
      onAnswer(answers[selected]);
    }
  }, [selected, answers, onAnswer]);

  if (!question) return null;

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
      {answers.map((ans, i) => {
        const letter = String.fromCharCode(65 + i); // A–E fixed order
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
  );
}
