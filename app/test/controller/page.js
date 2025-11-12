"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MultipleChoice from "../multiple-choice/page";
import TrueFalse from "../true-false/page";
import MultiSelect from "../multi-select/page";
import Response from "../response/page";

function TestControllerInner() {
  const params = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Load questions from URL or sessionStorage
  useEffect(() => {
    const encoded = params.get("data");
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encoded));

        // Ensure every question has a type
        const normalized = (decoded.questions || []).map((q) => ({
          type: q.type || "multiple-choice",
          ...q,
        }));

        sessionStorage.setItem(
          "testData",
          JSON.stringify({ ...decoded, questions: normalized })
        );
        setQuestions(normalized);
      } catch (err) {
        console.error("❌ Failed to decode test data:", err);
      }
    } else {
      const stored = sessionStorage.getItem("testData");
      if (stored) {
        const data = JSON.parse(stored);
        setQuestions(data.questions || []);
      } else {
        console.warn("⚠️ No test data found.");
      }
    }
    setLoading(false);
  }, [params]);

  if (loading) return null;
  if (!questions.length) return null;

  const question = questions[index];

  const handleAnswer = ({ correct }) => {
    console.log("Answer result:", correct);
    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex(index + 1);
      } else {
        alert("✅ Test complete!");
      }
    }, 2000);
  };

  // ✅ Dynamically render correct question type
  const renderComponent = () => {
    switch (question.type) {
      case "multiple-choice":
        return <MultipleChoice question={question} onAnswer={handleAnswer} />;
      case "true-false":
        return <TrueFalse question={question} onAnswer={handleAnswer} />;
      case "multi-select":
        return <MultiSelect question={question} onAnswer={handleAnswer} />;
      case "response":
        return <Response question={question} onAnswer={handleAnswer} />;
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
