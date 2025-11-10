import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, selectedTestTypes, questionsPerType } = await req.json();

    if (!topic || !selectedTestTypes || selectedTestTypes.length === 0) {
      return NextResponse.json({ error: "Missing topic or test types" }, { status: 400 });
    }

    let finalTestData = [];

    for (const type of selectedTestTypes) {
      const numQuestions = questionsPerType[type] || 5;

      let apiPath = "";
      switch (type) {
        case "multiple-choice":
          apiPath = "/api/multiple-choice";
          break;
        case "multi-select":
          apiPath = "/api/multi-select";
          break;
        case "true-false":
          apiPath = "/api/true-false";
          break;
        case "open-response":
          apiPath = "/api/open-response";
          break;
        case "short-answer":
          apiPath = "/api/short-answer";
          break;
        default:
          continue; // skip unknown types
      }

      const genRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}${apiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });

      if (!genRes.ok) throw new Error(`Failed to generate ${type} questions`);

      const testData = await genRes.json();
      finalTestData = finalTestData.concat(testData.map(q => ({ ...q, type })));
    }

    // Send combined test data to controller
    const controllerRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/test/controller.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalTestData),
    });

    if (!controllerRes.ok) throw new Error(`Controller failed: ${controllerRes.status}`);

    const finalData = await controllerRes.json();
    return NextResponse.json(finalData);

  } catch (err) {
    console.error("❌ Distribution error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
