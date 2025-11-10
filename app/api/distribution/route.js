// app/api/distribution/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions, testType } = await req.json();

    if (!topic || !testType) {
      return NextResponse.json(
        { error: "Missing topic or testType" },
        { status: 400 }
      );
    }

    let apiUrl = "";

    switch (testType) {
      case "multiple-choice":
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/mutiple-choice`;
        break;

      // 🔜 Add other test types here later
      // case "true-false":
      //   apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/true-false`;
      //   break;

      default:
        return NextResponse.json({ error: "Invalid testType" }, { status: 400 });
    }

    // Forward the request to the right test type API
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, numQuestions }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from ${testType} generator`);
    }

    const data = await res.json();
    return NextResponse.json({ ...data, testType });
  } catch (err) {
    console.error("❌ Distribution error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
