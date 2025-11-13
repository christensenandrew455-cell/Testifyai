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
          ...q,
        }));

        sessionStorage.setItem(
          "testData",
          JSON.stringify({ ...decoded, questions: normalized })
        );
        sessionStorage.setItem("currentIndex", "0");

        setQuestions(normalized);
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

  // ✅ Fixed handleAnswer
  const handleAnswer = ({ correct, userAnswer }) => {
    const safeUserAnswer =
      userAnswer === undefined || userAnswer === null ? "" : String(userAnswer);

    const safeCorrectAnswer = String(question.correct || "");

    const params = new URLSearchParams({
      question: question.question || "",
      userAnswer: safeUserAnswer,
      correctAnswer: safeCorrectAnswer,
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
      case "response":
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
