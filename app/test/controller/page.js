"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MultipleChoice from "../multiple-choice/page";
import TrueFalse from "../true-false/page";
import MultiSelect from "../multi-select/page";
import Response from "../response/page";

function TestControllerInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const encoded = params.get("data");
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encoded));
        setTopic(decoded.topic || "Unknown Topic");

        const normalized = (decoded.questions || []).map((q) => ({
          type: q.type || "multiple-choice",
          topic: decoded.topic || "Unknown Topic",
          ...q,
        }));

        // ---------------------------------------------------------
        // ✅ SHUFFLE CHANGES (ONLY THIS WAS ADDED)
        // ---------------------------------------------------------

        const earlyTypes = normalized.filter(
          (q) =>
            q.type === "multiple-choice" ||
            q.type === "true-false" ||
            q.type === "multi-select"
        );

        const shortAnswerTypes = normalized.filter(
          (q) => q.type === "short-answer"
        );

        const openResponseTypes = normalized.filter(
          (q) => q.type === "open-response"
        );

        function shuffle(arr) {
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr;
        }

        shuffle(earlyTypes);

        const finalOrder = [
          ...earlyTypes,
          ...shortAnswerTypes,
          ...openResponseTypes,
        ];

        // ---------------------------------------------------------

        sessionStorage.setItem(
          "testData",
          JSON.stringify({ ...decoded, questions: finalOrder })
        );
        sessionStorage.setItem("currentIndex", "0");

        setQuestions(finalOrder);
        setIndex(0);
      } catch (err) {
        console.error("❌ Failed to decode test data:", err);
      }
    } else {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        setQuestions(data.questions || []);
        setTopic(data.topic || "Unknown Topic");

        const savedIndex = Number(sessionStorage.getItem("currentIndex") || 0);
        setIndex(savedIndex);
      }
    }
    setLoading(false);
  }, [params]);

  useEffect(() => {
    if (questions.length > 0) {
      sessionStorage.setItem("currentIndex", String(index));
    }
  }, [index, questions]);

  if (loading) return null;
  if (!questions.length) return null;

  const question = questions[index];

  const handleAnswer = ({ correct, userAnswer }) => {
    const safeUserAnswer =
      userAnswer === undefined || userAnswer === null
        ? []
        : Array.isArray(userAnswer)
        ? userAnswer
        : [userAnswer];

    // ---------------------------------------------------------
    // ✅ FIX #1 — REAL correct answer detection
    // ---------------------------------------------------------
    let safeCorrectAnswer = [];

    if (question.type === "multiple-choice") {
      const idx = question.choices.indexOf(question.answer);
      safeCorrectAnswer = [idx];
    } else if (question.type === "true-false") {
      safeCorrectAnswer = [question.answer];
    } else if (question.type === "multi-select") {
      safeCorrectAnswer = question.answer.map((ans) =>
        question.choices.indexOf(ans)
      );
    } else if (
      question.type === "short-answer" ||
      question.type === "open-response"
    ) {
      safeCorrectAnswer = [question.answer];
    }
    // ---------------------------------------------------------

    const stored = sessionStorage.getItem("testData");
    let data;
    if (stored) {
      data = JSON.parse(stored);
    } else {
      data = { questions: [] };
    }

    // ---------------------------------------------------------
    // ✅ FIX #2 — Save correctAnswer so progress page can show it
    // ---------------------------------------------------------
    data.questions[index] = {
      ...question,
      userAnswer: safeUserAnswer,
      correctAnswer: safeCorrectAnswer,
      isCorrect: correct,
      topic: question.topic || topic,
    };
    // ---------------------------------------------------------

    sessionStorage.setItem("testData", JSON.stringify(data));

    const params = new URLSearchParams({
      question: question.question || "",
      userAnswer: encodeURIComponent(JSON.stringify(safeUserAnswer)),
      correctAnswer: encodeURIComponent(JSON.stringify(safeCorrectAnswer)),
      explanation: question.explanation || "",
      index: String(index),
      topic: topic || "",
    });

    const nextPage = correct ? "/correct" : "/incorrect";
    router.push(`${nextPage}?${params.toString()}`);
  };

  const renderComponent = () => {
    const commonProps = {
      question,
      onAnswer: handleAnswer,
      topic,
      currentIndex: index,
      totalQuestions: questions.length,
    };

    switch (question.type) {
      case "multiple-choice":
        return <MultipleChoice {...commonProps} />;
      case "true-false":
        return <TrueFalse {...commonProps} />;
      case "multi-select":
        return <MultiSelect {...commonProps} />;
      case "open-response":
      case "short-answer":
        return <Response {...commonProps} />;
      default:
        return <div>Unknown question type: {question.type}</div>;
    }
  };

  return <>{renderComponent()}</>;
}

export default function TestController() {
  return (
    <Suspense fallback={null}>
      <TestControllerInner />
    </Suspense>
  );
}
