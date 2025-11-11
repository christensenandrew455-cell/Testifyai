import { NextResponse } from "next/server";

// Example placeholder — later you can wire this up to your actual GPT logic.
export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, questionsPerType } = body;

    console.log("✅ API received:", body);

    // Simulate per-type question data (like what your GPT would return)
    const testData = Object.entries(questionsPerType).map(([type, count]) => ({
      type,
      questions: Array.from({ length: count }, (_, i) => ({
        question: `Sample ${type} question ${i + 1} about ${topic}`,
        options:
          type !== "open-response" && type !== "short-answer"
            ? ["A", "B", "C", "D"]
            : undefined,
        answer:
          type !== "open-response" && type !== "short-answer"
            ? "A"
            : undefined,
        explanation:
          type !== "open-response" && type !== "short-answer"
            ? `Because it's question ${i + 1} on ${topic}`
            : undefined,
      })),
    }));

    return NextResponse.json({
      topic,
      difficulty,
      testData,
    });
  } catch (err) {
    console.error("❌ Error in /api/distribution:", err);
    return NextResponse.json({ error: "Failed to generate test" }, { status: 500 });
  }
}
