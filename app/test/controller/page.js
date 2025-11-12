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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const encoded = params.get("data");
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encoded));

        // ✅ Ensure each question has a type
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
      // ✅ Fallback if reloading
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

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          color: "#1976d2",
          fontFamily: "Segoe UI, Roboto, sans-serif",
        }}
      >
        Loading test...
      </div>
    );

  if (!questions.length)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          color: "#1976d2",
          fontFamily: "Segoe UI, Roboto, sans-serif",
        }}
      >
        No questions available.
      </div>
    );

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
        backgroundColor: "#f8fafc",
        color: "#222",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            borderRadius: "12px",
            padding: "6px 16px",
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          Question {index + 1} of {questions.length}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#1976d2",
              fontSize: "1.1rem",
            }}
          >
            TheTestifyAI
          </div>

          <button
            onClick={() => router.push("/")}
            style={{
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#125a9c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1976d2")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.backgroundColor = "#0e4a84")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.backgroundColor = "#1976d2")
            }
          >
            Leave
          </button>
        </div>
      </div>

      {/* Active question component */}
      <div style={{ width: "100%", maxWidth: "800px" }}>{renderComponent()}</div>
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
            backgroundColor: "#f8fafc",
            color: "#1976d2",
            fontSize: "20px",
            fontWeight: "600",
            fontFamily: "Segoe UI, Roboto, sans-serif",
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
