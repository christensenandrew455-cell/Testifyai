import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} open-response questions on the topic: "${topic}".
Difficulty level: ${difficulty}.

Difficulty scale (1–9):
1 = Easy / Very Simple
2 = Easy / Slightly Challenging
3 = Easy / Hard
4 = Medium / Easy
5 = Medium / Medium
6 = Medium / Hard
7 = Hard / Easy
8 = Hard / Medium
9 = Hard / Very Hard
`;

Rules:
1. Only provide the question text — no answers, no explanations.
2. Output must be VALID JSON exactly like this:
[
  { "question": "string" }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```(json)?/g, "").trim();
    const questions = JSON.parse(content);

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Open-response generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
