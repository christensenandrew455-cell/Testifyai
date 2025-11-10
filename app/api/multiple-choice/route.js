import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    const prompt = `
You are TestifyAI — generate ${numQuestions} multiple-choice questions on "${topic}".
Rules:
1. Each question must have exactly ${numAnswers} answers.
2. Only one correct answer per question.
3. Make all incorrect answers plausible.
4. Include a one-sentence explanation.
Output JSON like:
[
  { "question": "string", "answers": ["A","B","C","D"], "correct": "string", "explanation": "string" }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```(json)?/g, "").trim().replace(/'/g, '"');
    const questions = JSON.parse(content);

    for (const q of questions) {
      q.answers = q.answers.sort(() => Math.random() - 0.5);
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Multiple-choice generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
