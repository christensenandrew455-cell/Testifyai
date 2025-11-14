"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Correct2PageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [canContinue, setCanContinue] = useState(false);

  const question = decodeURIComponent(params.get("question") || "No question provided");
  const userAnswer = decodeURIComponent(params.get("userAnswer") || "—");
  const feedback = decodeURIComponent(params.get("feedback") || "");

  // Safe parse for userAnswer
  const parsedUserAnswer = (() => {
    try {
      return JSON.parse(userAnswer);
    } catch {
      return userAnswer;
    }
  })();

  useEffect(() => {
    const t = setTimeout(() => setCanContinue(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleContinue = () => {
    if (!canContinue) return;

    const storedIndex = Number(sessionStorage.getItem("currentIndex") || "0");
    const testData = sessionStorage.getItem("testData");
    let data;

    try {
      data = testData ? JSON.parse(testData) : { questions: [] };
    } catch {
      data = { questions: [] };
    }

    data.questions[storedIndex] = {
      ...(data.questions[storedIndex] || {}),
      question,
      userAnswer: parsedUserAnswer,
      isCorrect: true,
      topic: data.questions[storedIndex]?.topic || "",
      explanation: feedback,
    };

    sessionStorage.setItem("testData", JSON.stringify(data));

    const nextIndex = storedIndex + 1;
    sessionStorage.setItem("currentIndex", String(nextIndex));

    if (nextIndex >= data.questions.length) {
      router.push("/ad");
    } else {
      router.push("/test/controller");
    }
  };

  return (
    <div
      onClick={handleContinue}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #81c784, #388e3c)",
        color: "white",
        textAlign: "center",
        cursor: canContinue ? "pointer" : "default",
        padding: "20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 8 }}>✅</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Correct!</h1>
      <div style={{ maxWidth: 760, textAlign: "center" }}>
        <p style={{ fontWeight: 700, margin: 0 }}>Question</p>
        <p style={{ margin: "2px 0 4px 0" }}>{question}</p>

        <p style={{ fontWeight: 700, margin: "4px 0 2px 0" }}>Your answer</p>
        <p style={{ margin: "2px 0 4px 0" }}>{parsedUserAnswer}</p>

        {feedback && (
          <>
            <p style={{ fontWeight: 700, margin: "4px 0 2px 0" }}>Explanation</p>
            <p style={{ margin: "2px 0 4px 0" }}>{feedback}</p>
          </>
        )}
      </div>

      <small style={{ marginTop: 20 }}>
        {canContinue ? "Click anywhere to continue" : "Please wait..."}
      </small>
    </div>
  );
}

export default function Correct2Page() {
  return (
    <Suspense fallback={null}>
      <Correct2PageContent />
    </Suspense>
  );
}
