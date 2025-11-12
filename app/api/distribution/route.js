import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log("🧩 Distribution starting:", { topic, difficulty, questionsPerType });

    // Pick the first test type (e.g., "multiple-choice")
    const [firstType, count] = Object.entries(questionsPerType)[0];

    // Call the selected test type API (it will redirect to /test/controller)
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/${firstType}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, numQuestions: count }),
    });

    const text = await response.text();
    console.log("📦 Distribution response:", text);

    // If /api/multiple-choice already redirects, pass that redirect forward
    if (response.status === 307 || response.redirected) {
      return NextResponse.redirect(response.url);
    }

    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Distribution route failed:", err);
    return NextResponse.json({ error: "Distribution failed" }, { status: 500 });
  }
}
