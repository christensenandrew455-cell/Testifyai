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

    let testData;

    switch (testType) {
      case "multiple-choice": {
        const genRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/mutiple-choice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty, numQuestions }),
        });

        if (!genRes.ok)
          throw new Error(`Failed to generate multiple-choice questions`);

        const generated = await genRes.json();
        testData = generated;
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid testType" }, { status: 400 });
    }

    // ✅ Send data to test controller
    const controllerRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/test/controller.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...testData, testType }),
    });

    if (!controllerRes.ok)
      throw new Error(`Controller failed: ${controllerRes.status}`);

    const finalData = await controllerRes.json();
    return NextResponse.json(finalData);
  } catch (err) {
    console.error("❌ Distribution error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
