import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions } = await req.json();

    const prompt = `
      Create a multiple-choice test about "${topic}" at difficulty level ${difficulty}.
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const text = response.choices[0].message.content.trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON from AI:", text);
      data = { questions: [] };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating test:", error);
    return NextResponse.json({ error: "Failed to generate test" }, { status: 500 });
  }
}
