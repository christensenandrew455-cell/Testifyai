import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty = 1, questionsPerType } = await req.json();

    if (!topic || !questionsPerType || Object.keys(questionsPerType).length === 0) {
      console.error("❌ Missing data in request body:", { topic, questionsPerType });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log("🧩 Distribution starting:", { topic, difficulty, questionsPerType });

    const allQuestions = [];

    // Loop over each selected test type
    for (const [type, count] of Object.entries(questionsPerType)) {
      try {
        // Use relative URL to avoid host/protocol issues
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty, numQuestions: count }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`❌ Inner API failed: ${type}`, text);
          return NextResponse.json(
            { error: `Inner API failed: ${type}`, details: text },
            { status: 500 }
          );
        }

        const data = await res.json();
        const questionsWithType = (data.questions || []).map((q) => ({
          type,
          ...q,
        }));

        allQuestions.push(...questionsWithType);
      } catch (err) {
        console.error(`❌ Inner API fetch error: ${type}`, err);
        return NextResponse.json(
          { error: `Inner API fetch error: ${type}`, details: err.message },
          { status: 500 }
        );
      }
    }

    // Return all questions as JSON
    return NextResponse.json({
      topic,
      difficulty,
      questions: allQuestions,
    });
  } catch (err) {
    console.error("❌ Distribution route failed:", err);
    return NextResponse.json(
      { error: "Distribution failed", details: err.message },
      { status: 500 }
    );
  }
}
