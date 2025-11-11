// app/api/multiple-choice/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    // try to extract first JSON array/object from text
    const match = text.match(/(\[.*\]|\{.*\})/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
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

    // Build prompt that requires valid JSON output
    const prompt = `
You are TestifyAI. Generate ${numQuestions} high-quality multiple-choice questions about "${topic}".
Difficulty level: ${difficulty}

Rules:
1) Provide exactly ${numQuestions} questions as a JSON array.
2) Each question object must have these fields:
   - "question": string
   - "answers": array of exactly 4 strings (A-D)
   - "correct": one of the answer strings (exact text) OR a single letter "A"/"B"/"C"/"D"
   - "explanation": one-sentence explanation for the correct answer
3) Output ONLY valid JSON (no additional commentary, no markdown fences).
Example:
[
  {
    "question": "string",
    "answers": ["A","B","C","D"],
    "correct": "A",
    "explanation": "string"
  }
]
`;

    // Call OpenAI (chat completion)
    let content = "";
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      content = response.choices?.[0]?.message?.content?.trim() ?? "";
      // remove triple-backtick wrappers if present
      content = content.replace(/```(json)?/g, "").trim();
    } catch (err) {
      console.error("❌ OpenAI call failed:", err);
      content = null;
    }

    let parsed = null;
    if (content) parsed = safeParseJSON(content);

    // If parsing failed or content empty, fallback to mock generation
    if (!parsed) {
      console.warn("⚠️ OpenAI did not return clean JSON — falling back to mock questions.");
      // create mock questions in the same shape
      const mock = Array.from({ length: numQuestions }).map((_, i) => ({
        question: `Sample multiple-choice question ${i + 1} about ${topic}`,
        answers: [
          `Correct-ish fact about ${topic}`,
          `Plausible distractor 1`,
          `Plausible distractor 2`,
          `Plausible distractor 3`,
        ],
        correct: `Correct-ish fact about ${topic}`,
        explanation: `Because it's related to ${topic} (difficulty ${difficulty}).`,
      }));
      return NextResponse.json({ questions: mock });
    }

    // parsed should be an array of question objects
    const questionsArray = Array.isArray(parsed) ? parsed : parsed.questions ?? [];

    // Normalize each question and shuffle answers
    const normalized = questionsArray.map((q, i) => {
      const answers = q.answers ?? q.options ?? [];
      // ensure there are 4 answers (if fewer, pad with placeholders)
      while (answers.length < 4) answers.push("N/A");
      // shuffle answers but keep original correct text matchable
      const shuffled = answers.slice().sort(() => Math.random() - 0.5);
      let correct = q.correct ?? q.answer ?? "";
      // If correct is a letter A-D, convert it to the corresponding text
      if (typeof correct === "string" && /^[A-D]$/i.test(correct.trim())) {
        const idx = correct.toUpperCase().charCodeAt(0) - 65;
        correct = answers[idx] ?? answers[0];
      }
      // If correct text is one of original answers, find the corresponding shuffled one (we keep text so it's fine)
      return {
        id: q.id ?? `multiple-choice-${i + 1}`,
        question: q.question ?? `Question ${i + 1} about ${topic}`,
        answers: shuffled,
        correct: correct,
        explanation: q.explanation ?? q.explain ?? "",
      };
    });

    return NextResponse.json({ questions: normalized });
  } catch (err) {
    console.error("❌ /api/multiple-choice error:", err);
    return NextResponse.json({ error: "Multiple-choice generation failed" }, { status: 500 });
  }
}
