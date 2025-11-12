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

    // Read bypass token from env (set this in Vercel)
    const bypassToken = process.env.VERCEL_PROTECTION_BYPASS_TOKEN || null;

    for (const [type, count] of Object.entries(questionsPerType)) {
      try {
        // Build absolute URL for server-side fetch
        const protocol = process.env.VERCEL ? "https" : "http";
        const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
        if (!host) throw new Error("Cannot determine host for inner API request");
        const apiUrl = `${protocol}://${host}/api/${type}`;

        console.log("➡️ Fetching inner API:", apiUrl, { topic, difficulty, numQuestions: count });

        // Prepare headers (include bypass header if token is configured)
        const headers = { "Content-Type": "application/json" };
        if (bypassToken) {
          headers["x-vercel-protection-bypass"] = bypassToken;
        } else {
          // Optional: warn in logs if protection is enabled but token not provided
          console.warn("⚠️ VERCEL_PROTECTION_BYPASS_TOKEN not set — if deployment protection is enabled, inner fetch may be blocked.");
        }

        const res = await fetch(apiUrl, {
          method: "POST",
          headers,
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
