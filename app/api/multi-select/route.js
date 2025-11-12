import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} multi-select questions on "${topic}".
Difficulty level: ${difficulty}

Rules:
1. Each question has 2-${numAnswers} answer options labeled A-F.
2. Each question can have 1 or more correct answers.
3. Include a one-sentence educational explanation.
4. Output ONLY valid JSON like this:
[
  {
    "question": "string",
    "answers": ["A","B","C","D","E","F"],
    "correct": ["string","string"],
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
    content = content.replace(/```(json)?/g, "").trim();
    const questions = JSON.parse(content);

    questions.forEach(q => q.answers = q.answers.sort(() => Math.random() - 0.5));

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Multi-select generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
