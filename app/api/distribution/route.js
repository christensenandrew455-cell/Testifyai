import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType) {
      return NextResponse.json(
        { error: "Missing topic or question configuration" },
        { status: 400 }
      );
    }

    const testTypeData = {};

    // Generate questions for each type
    for (const [type, count] of Object.entries(questionsPerType)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/test/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty, count }),
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data.questions)) {
          testTypeData[type] = data.questions;
        } else {
          console.warn(`⚠️ Failed generating ${type} questions`, data);
          testTypeData[type] = [];
        }
      } catch (err) {
        console.error(`❌ Error fetching ${type} questions:`, err);
        testTypeData[type] = [];
      }
    }

    // Now assemble and order them
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
        };

        if (type === "open-response") openResponse.push(formatted);
        else if (type === "short-answer") shortAnswer.push(formatted);
        else mixedQuestions.push(formatted);
      }
    }

    const shuffled = mixedQuestions.sort(() => Math.random() - 0.5);

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
    console.error("❌ Distribution API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
