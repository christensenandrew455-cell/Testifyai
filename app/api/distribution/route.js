import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType || Object.keys(questionsPerType).length === 0) {
      return NextResponse.json({ error: "Missing topic or question type selections" }, { status: 400 });
    }

    // Build promises to fetch each question type's generator
    const typeEntries = Object.entries(questionsPerType);

    const results = await Promise.all(
      typeEntries.map(async ([type, numQuestions]) => {
        try {
          const genRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty, numQuestions }),
          });

          if (!genRes.ok) {
            throw new Error(`${type} generator failed`);
          }

          const data = await genRes.json();
          return { type, questions: data.questions || [] };
        } catch (err) {
          console.error(`❌ Error fetching ${type}:`, err);
          return { type, questions: [], error: err.message };
        }
      })
    );

    // Combine into a single testData array
    const testData = results.flatMap((r) =>
      r.questions.map((q, i) => ({
        id: `${r.type}-${i + 1}`,
        type: r.type,
        topic,
        difficulty,
        ...q,
      }))
    );

    // Send to controller
    const controllerRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/test/controller`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testData, topic, difficulty }),
    });

    if (!controllerRes.ok) throw new Error(`Controller failed: ${controllerRes.status}`);

    const finalData = await controllerRes.json();
    return NextResponse.json(finalData);
  } catch (err) {
    console.error("❌ Distribution error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
