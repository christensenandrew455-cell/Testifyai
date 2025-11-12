import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/(\[.*\]|\{.*\})/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req) {
  try {
    const { topic, difficulty = 1, numQuestions = 5 } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const prompt = `
You are TestifyAI. Generate ${numQuestions} multiple-choice questions about "${topic}".
Difficulty: ${difficulty}
Return ONLY JSON:
[
  {
    "question": "string",
    "answers": ["A","B","C","D"],
    "correct": "A",
    "explanation": "string"
  }
]
`;

    let content = "";
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      content = response.choices?.[0]?.message?.content?.trim()?.replace(/```json|```/g, "") ?? "";
    } catch (err) {
      console.error("❌ OpenAI call failed:", err);
      content = "";
    }

    let parsed = safeParseJSON(content);
    if (!parsed) {
      console.warn("⚠️ Using mock fallback questions.");
      parsed = Array.from({ length: numQuestions }).map((_, i) => ({
        question: `Sample question ${i + 1} about ${topic}`,
        answers: ["Option A", "Option B", "Option C", "Option D"],
        correct: "Option A",
        explanation: `Explanation for question ${i + 1}.`,
      }));
    }

    // Encode the data and redirect
    const encoded = encodeURIComponent(JSON.stringify({ topic, difficulty, questions: parsed }));
    return NextResponse.redirect(`/test/controller?data=${encoded}`);
  } catch (err) {
    console.error("❌ /api/multiple-choice error:", err);
    return NextResponse.json({ error: "Multiple-choice generation failed" }, { status: 500 });
  }
}
