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
        sessionStorage.setItem("resumeIndex", "0");

        setQuestions(normalized);

        // start at resumeIndex
        const savedResume = Number(sessionStorage.getItem("resumeIndex") || 0);
        setIndex(savedResume);
      } catch (err) {
        console.error("❌ Failed to decode test data:", err);
      }
    } else {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        setQuestions(data.questions || []);
        setTopic(data.topic || "Unknown Topic");

        const savedResume = Number(sessionStorage.getItem("resumeIndex") || 0);
        setIndex(savedResume);
      }
    }
    setLoading(false);
  }, [params]);

  useEffect(() => {
    if (questions.length > 0) {
      sessionStorage.setItem("resumeIndex", String(index));
    }
  }, [index, questions]);

  if (loading) return null;
  if (!questions.length) return null;

  const question = questions[index];

  const handleAnswer = ({ correct, userAnswer }) => {
    // don’t advance yet — feedback page will do that
    const nextPage = correct ? "/correct" : "/incorrect";

    const params = new URLSearchParams({
      question: question.question,
      userAnswer: JSON.stringify(userAnswer),
      correctAnswer: JSON.stringify(question.correct),
      explanation: question.explanation || "",
      index: String(index),
      topic,
    });

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
