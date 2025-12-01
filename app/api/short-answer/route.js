import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} short-answer questions on the topic: "${topic}".
Difficulty level: ${difficulty}.

Difficulty scale (1–9):
1 = easy easy, 
2 = medium easy, 
3 = hard easy, 
4 = easy medium, 
5 = medium medium, 
6 = hard medium, 
7 = easy hard, 
8 = medium hard, 
9 = hard hard

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
    console.error("❌ Short-answer generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
