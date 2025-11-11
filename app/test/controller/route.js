import { NextResponse } from "next/server";

/**
 * This controller organizes and delivers the final test structure.
 * It receives data from /api/distribution and outputs a mixed test object
 * ready to be saved in sessionStorage for /test/page.js to use.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, testTypeData } = body;

    if (!testTypeData || typeof testTypeData !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid testTypeData" },
        { status: 400 }
      );
    }

    // Combine and label all question types
    const mixedQuestions = [];
    const openResponse = [];
    const shortAnswer = [];

    for (const [type, questions] of Object.entries(testTypeData)) {
      if (!Array.isArray(questions)) continue;

      for (const q of questions) {
        const formatted = {
          type,
          question: q.question,
          options: q.options || q.answers || [],
          correctAnswer: q.correct || q.correctAnswer || null,
          explanation: q.explanation || "",
          questionNumber: null, // will be set later
        };

        if (type === "open-response") openResponse.push(formatted);
        else if (type === "short-answer") shortAnswer.push(formatted);
        else mixedQuestions.push(formatted);
      }
    }

    // Mix all non-short/open types randomly
    const shuffled = mixedQuestions.sort(() => Math.random() - 0.5);

    // Short Answer → Open Response come at the end
    const finalQuestions = [
      ...shuffled,
      ...shortAnswer,
      ...openResponse,
    ].map((q, i) => ({ ...q, questionNumber: i + 1 }));

    const finalData = {
      topic,
      difficulty,
      totalQuestions: finalQuestions.length,
      questions: finalQuestions,
    };

    return NextResponse.json(finalData);
  } catch (err) {
    console.error("❌ Test Controller Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
