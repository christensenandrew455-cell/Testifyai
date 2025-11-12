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

  useEffect(() => {
    const encoded = params.get("data");
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encoded));

        // ✅ Ensure each question has a type so renderComponent works properly
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
      // ✅ fallback if reloading the page
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

  if (loading) return <div style={{ color: "white" }}>Loading test...</div>;
  if (!questions.length)
    return <div style={{ color: "white" }}>No questions available.</div>;

  const question = questions[index];

  const handleAnswer = ({ correct }) => {
    console.log("Answer result:", correct);
    setTimeout(() => {
      if (index + 1 < questions.length) setIndex(index + 1);
      else alert("✅ Test complete!");
    }, 2000);
  };

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #001f3f, #000)",
        padding: "40px 20px",
        color: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Question {index + 1} of {questions.length}
      </h2>
      {renderComponent()}
    </div>
  );
}

export default function TestController() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #001f3f, #000)",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Loading test controller...
        </div>
      }
    >
      <TestControllerInner />
    </Suspense>
  );
}
