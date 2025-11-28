import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty = 1, questionsPerType, userId } = await req.json();

    if (!topic || !questionsPerType || Object.keys(questionsPerType).length === 0) {
      console.error("❌ Missing data in request body:", { topic, questionsPerType });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    if (!userId) {
      console.warn("⚠️ userId not provided — inner APIs will use default ChatGPT mode.");
    }

    console.log("🧩 Distribution starting:", { topic, difficulty, questionsPerType, userId });

    const allQuestions = [];
    const bypassToken = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || null;

    const protocol = process.env.VERCEL ? "https" : "http";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (!host) throw new Error("Cannot determine host for inner API request");

    for (const [type, count] of Object.entries(questionsPerType)) {
      try {
        const apiUrl = `${protocol}://${host}/api/${type}`;
        console.log("➡️ Fetching inner API:", apiUrl, { topic, difficulty, numQuestions: count, userId });

        const headers = { "Content-Type": "application/json" };
        if (bypassToken) {
          headers["x-vercel-protection-bypass"] = bypassToken;
        }

        // ✅ Pass userId to inner API
        const res = await fetch(apiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({ topic, difficulty, numQuestions: count, userId }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`❌ Inner API failed: ${type}`, text.slice(0, 1000));
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
