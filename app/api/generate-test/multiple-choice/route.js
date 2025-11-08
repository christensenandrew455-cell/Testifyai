import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions, numAnswers = 4 } = await req.json();

    const prompt = `
You are TestifyAI — generate ${numQuestions} multiple-choice questions on "${topic}".

Rules:
1. Each question must have exactly ${numAnswers} answers labeled A, B, C, D, E (use only what is needed if ${numAnswers}<5).
2. Only one correct answer per question.
3. Make all incorrect answers plausible.
4. Include a one-sentence educational explanation for why the correct answer is right.
5. Output ONLY valid JSON like this:
[
  {
    "question": "string",
    "answers": ["A", "B", "C", "D", "E"],
    "correct": "string",
    "explanation": "string"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const questions = JSON.parse(content);

    // Shuffle answers per question
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
