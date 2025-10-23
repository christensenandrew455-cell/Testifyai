import { NextResponse } from "next/server";
import OpenAI from "openai";

// ✅ Safe environment logging (for debugging)
console.log("🔍 Environment check:");
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY
    ? process.env.OPENAI_API_KEY.slice(0, 10) + "..."
    : "❌ missing"
);
console.log("OPENAI_PROJECT_ID:", process.env.OPENAI_PROJECT_ID || "❌ missing");
console.log("OPENAI_ORG_ID:", process.env.OPENAI_ORG_ID || "❌ missing");

// ✅ Initialize OpenAI client with all necessary fields for project keys
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID,
  organization: process.env.OPENAI_ORG_ID,
});

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions } = await req.json();

    // 🧠 Prompt sent to GPT
    const prompt = `
      Create a multiple-choice test about "${topic}" at difficulty level ${difficulty}.
      The test should have ${numQuestions} questions.
      Each question must have 4 answer options: one correct and three incorrect but related answers.
      Format the output strictly as JSON with this structure:
      {
        "questions": [
          {
            "question": "string",
            "answers": ["a", "b", "c", "d"],
            "correct": "exact answer string"
          }
        ]
      }
    `;

    // 🧠 Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const text = response.choices[0].message.content.trim();

    // ✅ Try to parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Invalid JSON from AI:", text);
      data = { questions: [] };
    }

    console.log(
      "✅ Successfully generated test with",
      data.questions?.length || 0,
      "questions"
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error generating test:", error);
    return NextResponse.json(
      { error: "Failed to generate test" },
      { status: 500 }
    );
  }
}
