import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType || Object.keys(questionsPerType).length === 0) {
      return NextResponse.json({ error: "Missing topic or test types" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const finalQuestions = [];

    for (const [type, numQuestions] of Object.entries(questionsPerType)) {
      const res = await fetch(`${baseUrl}/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate ${type} questions`);
      }

      const data = await res.json();

      if (data.questions && Array.isArray(data.questions)) {
        finalQuestions.push(...data.questions.map((q) => ({ ...q, type })));
      }
    }

    return NextResponse.json({ questions: finalQuestions });
  } catch (err) {
    console.error("❌ Distribution error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
