import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType || Object.keys(questionsPerType).length === 0) {
      return NextResponse.json({ error: "Missing topic or question type selections" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    // For each selected type, call the generator and collect results
    const typeEntries = Object.entries(questionsPerType); // [ [type, num], ... ]

    const results = await Promise.all(
      typeEntries.map(async ([type, numQuestions]) => {
        try {
          const res = await fetch(`${baseUrl}/api/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty, numQuestions }),
          });

          if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(`${type} generator failed: ${res.status} ${txt}`);
          }

          const data = await res.json();
          // Expect data.questions = [...]
          return { type, questions: Array.isArray(data.questions) ? data.questions : [] };
        } catch (err) {
          console.error(`❌ Error fetching ${type}:`, err);
          // Return empty questions for that type but don't fail entire distribution
          return { type, questions: [], error: err.message };
        }
      })
    );

    // Combine into a flat testData array with metadata
    const testData = results.flatMap((r) =>
      r.questions.map((q, i) => ({
        id: `${r.type}-${i + 1}`,
        type: r.type,
        topic,
        difficulty,
        ...q,
      }))
    );

    // Now send the combined testData to the server-side test controller route
    // (It will normalize and return the final structured test object)
    const controllerRes = await fetch(`${baseUrl}/test/controller`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testData, topic, difficulty }),
    });

    if (!controllerRes.ok) {
      const txt = await controllerRes.text().catch(() => "");
      throw new Error(`Controller failed: ${controllerRes.status} ${txt}`);
    }

    const finalData = await controllerRes.json();

    // Return the normalized test object back to the frontend
    return NextResponse.json(finalData);
  } catch (err) {
    console.error("❌ Distribution error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
