import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType)
      return NextResponse.json({ error: "Missing data" }, { status: 400 });

    // Call distribution API to generate test data
    const distRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/distribution`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, questionsPerType }),
    });

    if (!distRes.ok) throw new Error("Distribution API failed");

    const distData = await distRes.json();

    // Organize questions by type
    const organized = Object.entries(questionsPerType).flatMap(([type]) =>
      distData.questions.filter((q) => q.type === type)
    );

    // Save unified test structure
    return NextResponse.json({
      topic,
      difficulty,
      questions: organized,
    });
  } catch (err) {
    console.error("❌ Controller error:", err);
    return NextResponse.json({ error: "Controller failed" }, { status: 500 });
  }
}
