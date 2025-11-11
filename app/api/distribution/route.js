import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, questionsPerType } = body;

    if (!topic || !questionsPerType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("✅ API received:", body);

    // Build unified question list
    const questions = Object.entries(questionsPerType).flatMap(([type, count]) =>
      Array.from({ length: count }, (_, i) => ({
        id: `${type}-${i + 1}`,
        type,
        question: `Sample ${type} question ${i + 1} about ${topic}`,
        answers:
          type !== "open-response" && type !== "short-answer"
            ? ["A", "B", "C", "D"]
            : undefined,
        correct:
          type !== "open-response" && type !== "short-answer"
            ? "A"
            : undefined,
        explanation:
          type !== "open-response" && type !== "short-answer"
            ? `Because it's question ${i + 1} on ${topic}`
            : undefined,
      }))
    );

    const responseData = {
      topic,
      difficulty,
      questions,
    };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error("❌ Error in /api/distribution:", err);
    return NextResponse.json({ error: "Failed to generate test" }, { status: 500 });
  }
}
