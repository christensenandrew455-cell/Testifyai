import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType) {
      console.error("❌ Missing data in request body:", { topic, questionsPerType });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log("🧩 Distribution starting:", { topic, difficulty, questionsPerType });

    // pick the first test type
    const [firstType, count] = Object.entries(questionsPerType)[0];
    if (!firstType) {
      return NextResponse.json({ error: "No test type specified" }, { status: 400 });
    }

    const { headers } = req;
    const host = headers.get("host");
    const protocol = process.env.VERCEL ? "https" : "http";
    const apiUrl = `${protocol}://${host}/api/${firstType}`;

    console.log("➡️ Fetching questions from:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, numQuestions: count }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Inner API failed:", text);
      return NextResponse.json({ error: "Inner API failed" }, { status: 500 });
    }

    const data = await res.json();
    const encoded = encodeURIComponent(JSON.stringify(data));

    const redirectUrl = `/test/controller?data=${encoded}`;
    console.log("✅ Redirecting to:", redirectUrl);

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ Distribution route failed hard:", err);
    return NextResponse.json({ error: "Distribution failed" }, { status: 500 });
  }
}
