import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Base URL fix — works in local + deployed
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    console.log("🧩 Test distribution starting...");
    console.log("➡️ Topic:", topic);
    console.log("➡️ Difficulty:", difficulty);
    console.log("➡️ Types:", questionsPerType);

    // Function to get questions per type
    async function generateForType(type, count) {
      const endpoint = `${baseUrl}/api/${type}`;
      console.log(`📡 Fetching: ${endpoint} (${count} questions)`);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty, numQuestions: count }),
        });

        const text = await res.text();
        console.log(`🔍 Raw response for ${type}:`, text);

        if (!res.ok) throw new Error(text || "Failed response");

        const data = JSON.parse(text);
        return data.questions?.map((q) => ({ ...q, type })) || [];
      } catch (err) {
        console.error(`❌ Error fetching ${type}:`, err);
        return [];
      }
    }

    // Generate all question types
    const allQuestions = [];
    for (const [type, count] of Object.entries(questionsPerType)) {
      const q = await generateForType(type, count);
      allQuestions.push(...q);
    }

    if (allQuestions.length === 0) {
      console.warn("⚠️ No questions were returned — likely a path or generation issue.");
    }

    return NextResponse.json({
      topic,
      difficulty,
      questions: allQuestions,
    });
  } catch (err) {
    console.error("❌ Controller failed:", err);
    return NextResponse.json({ error: "Controller failed" }, { status: 500 });
  }
}

