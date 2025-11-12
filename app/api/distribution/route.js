import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log("🧩 Distribution starting:", { topic, difficulty, questionsPerType });

    // Pick first available type (e.g. "multiple-choice")
    const [firstType, count] = Object.entries(questionsPerType)[0];

    // Construct internal API URL
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const apiUrl = `${base}/api/${firstType}`;

    console.log("➡️ Sending to:", apiUrl);

    // Call test-type API directly to get question data (not follow redirects)
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, numQuestions: count }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Inner API error:", text);
      return NextResponse.json({ error: "Inner API failed" }, { status: 500 });
    }

    // Get the test data returned (JSON, not redirect)
    const text = await res.text();
    console.log("📦 Got response text:", text);

    // If it’s already encoded redirect from /api/multiple-choice, extract it:
    if (text.includes("/test/controller?data=")) {
      const match = text.match(/\/test\/controller\?data=[^"'}\]]+/);
      if (match) {
        console.log("🔁 Redirecting to:", match[0]);
        return NextResponse.redirect(match[0]);
      }
    }

    // Otherwise parse it as JSON and redirect manually
    const data = JSON.parse(text);
    const encoded = encodeURIComponent(JSON.stringify(data));
    const redirectUrl = `/test/controller?data=${encoded}`;

    console.log("✅ Redirecting to:", redirectUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ Distribution route failed:", err);
    return NextResponse.json({ error: "Distribution failed" }, { status: 500 });
  }
}
