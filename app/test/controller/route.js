import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { testData, topic, difficulty } = await req.json();

    if (!testData || !Array.isArray(testData)) {
      return NextResponse.json({ error: "Invalid or missing test data" }, { status: 400 });
    }

    // Organize all questions with their metadata
    const organizedTest = {
      topic,
      difficulty,
      totalQuestions: testData.length,
      questions: testData.map((q, index) => ({
        index,
        id: q.id,
        type: q.type,
        question: q.question,
        answers: q.answers || [],
        correct: q.correct || null,
        explanation: q.explanation || "",
      })),
    };

    // Return structured test data
    return NextResponse.json(organizedTest);
  } catch (err) {
    console.error("❌ Test controller error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
