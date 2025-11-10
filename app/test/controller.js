import { NextResponse } from "next/server";

// 🧩 This controller takes the generated questions and builds a consistent structure
export async function POST(req) {
  try {
    const { questions, testType, topic, difficulty } = await req.json();

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Invalid question format" },
        { status: 400 }
      );
    }

    // 🔧 Build a normalized structure that can work for any test type
    const formattedTest = {
      topic: topic || "Untitled",
      testType: testType || "multiple-choice",
      difficulty: difficulty || 1,
      totalQuestions: questions.length,
      questions: questions.map((q, i) => ({
        questionNumber: i + 1,
        type: testType,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.answer,
        explanation: q.explanation || "",
      })),
    };

    // 💾 Store it for now in sessionStorage on the frontend (the /test page will handle it)
    return NextResponse.json(formattedTest);
  } catch (err) {
    console.error("❌ Controller error:", err);
    return NextResponse.json({ error: "Controller failed" }, { status: 500 });
  }
}
