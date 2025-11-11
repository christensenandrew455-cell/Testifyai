import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, questionsPerType } = body;

    if (!topic || !questionsPerType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("✅ Generating real test for:", topic, difficulty, questionsPerType);

    // Helper: calls the right sub-generator
    async function generateForType(type, count) {
      const endpoint = `/api/${type}`;
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty, numQuestions: count }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Sub-generator failed");
        // Add type field if not present
        return data.questions.map((q) => ({ ...q, type }));
      } catch (err) {
        console.error(`❌ Error generating ${type}:`, err);
        return [];
      }
    }

    // Loop through each test type and generate
    const allQuestions = [];
    for (const [type, count] of Object.entries(questionsPerType)) {
      const qSet = await generateForType(type, count);
      allQuestions.push(...qSet);
    }

    const responseData = {
      topic,
      difficulty,
      questions: allQuestions,
    };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error("❌ Error in /api/distribution:", err);
    return NextResponse.json({ error: "Failed to generate test" }, { status: 500 });
  }
}
