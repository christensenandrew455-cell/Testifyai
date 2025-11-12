import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType || Object.keys(questionsPerType).length === 0) {
      console.error("❌ Missing data in request body:", { topic, questionsPerType });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log("🧩 Distribution starting:", { topic, difficulty, questionsPerType });

    const allQuestions = [];

    for (const [type, count] of Object.entries(questionsPerType)) {
      const { headers } = req;
      const host = headers.get("host");
      const protocol = process.env.VERCEL ? "https" : "http";
      const apiUrl = `${protocol}://${host}/api/${type}`;

      console.log("➡️ Fetching questions from:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions: count }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Inner API failed:", text);
        return NextResponse.json({ error: `Inner API failed: ${type}` }, { status: 500 });
      }

      const data = await res.json();
      const questionsWithType = (data.questions || []).map((q) => ({
        type,
        ...q,
      }));

      allQuestions.push(...questionsWithType);
    }

    // Return all questions as JSON
    return NextResponse.json({ topic, difficulty, questions: allQuestions });
  } catch (err) {
    console.error("❌ Distribution route failed hard:", err);
    return NextResponse.json({ error: "Distribution failed", details: err.message }, { status: 500 });
  }
}
