import { NextResponse } from "next/server";
import multipleChoice from "./multiple-choice/route";

export async function POST(req) {
  try {
    const {
      topic,
      difficulty,
      numQuestions,
      selectedTypes,
      typeDistribution,
      answerCounts,
    } = await req.json();

    if (!selectedTypes || selectedTypes.length === 0) {
      return NextResponse.json({ error: "No test types selected." }, { status: 400 });
    }

    let allQuestions = [];

    // For now, we only support multiple-choice to test the full flow
    if (selectedTypes.includes("multiple-choice")) {
      const count = typeDistribution?.["multiple-choice"] || numQuestions || 1;
      const numAnswers = answerCounts?.["multiple-choice"] || 4;

      // 👇 Call directly into the multiple-choice generator
      const subReq = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ topic, difficulty, numQuestions: count, numAnswers }),
      });
      const subRes = await multipleChoice.POST(subReq);
      const data = await subRes.json();

      if (data.questions) {
        allQuestions = data.questions.map((q) => ({
          ...q,
          type: "multiple-choice",
        }));
      }
    }

    return NextResponse.json({ questions: allQuestions });
  } catch (err) {
    console.error("❌ Unified test generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
