// app/api/mutiple-choice/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    // 🧩 Mock multiple-choice generator for now
    const mockQuestions = Array.from({ length: numQuestions || 5 }).map(
      (_, i) => ({
        question: `(${i + 1}) What is a fact about ${topic}?`,
        answers: ["Option A", "Option B", "Option C", "Option D"],
        correct: "Option A",
        explanation: `Because it relates to ${topic} at difficulty ${difficulty}.`,
      })
    );

    return NextResponse.json({ questions: mockQuestions });
  } catch (err) {
    console.error("❌ Multiple Choice API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
