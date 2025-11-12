import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType) {
      console.error("❌ Missing data in request body:", { topic, questionsPerType });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log("🧩 Distribution starting:", { topic, difficulty, questionsPerType });

    // Pick the first test type
    const [firstType, count] = Object.entries(questionsPerType)[0];
    if (!firstType) {
      console.error("❌ No test type found in questionsPerType");
      return NextResponse.json({ error: "No test type specified" }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const apiUrl = `${base}/api/${firstType}`;

    console.log("➡️ Fetching from:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, numQuestions: count }),
    });

    const text = await res.text();
    console.log("📦 Raw response text:", text.slice(0, 200));

    // ✅ Handle redirect manually
    if (text.includes("/test/controller?data=")) {
      const match = text.match(/\/test\/controller\?data=[^"'}\]]+/);
      if (match) {
        console.log("🔁 Redirecting directly to:", match[0]);
        return NextResponse.redirect(match[0]);
      }
    }

    // Otherwise parse as JSON and manually encode/redirect
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ Failed to parse JSON from inner API:", e);
      return NextResponse.json({ error: "Invalid response from inner API" }, { status: 500 });
    }

    const encoded = encodeURIComponent(JSON.stringify(data));
    const redirectUrl = `/test/controller?data=${encoded}`;
    console.log("✅ Redirecting to:", redirectUrl);

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ Distribution route failed hard:", err);
    return NextResponse.json({ error: "Distribution failed" }, { status: 500 });
  }
}
