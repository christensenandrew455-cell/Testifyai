import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions, minCorrect, maxAnswers } = await req.json();

    const prompt = `
You are TestifyAI — generate ${numQuestions} multi-select questions on "${topic}".

Rules:
1. Each question must have between 1 and ${maxAnswers} answers labeled A–F (use as many as needed).
2. The number of correct answers should be random for each question (min 1, max all answers).
3. Include a one-sentence educational explanation for why each correct answer is correct.
4. Output ONLY valid JSON like this:
[
  {
    "question": "string",
    "answers": ["A", "B", "C", "D", "E", "F"],
    "correct": ["string", "string"], 
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
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
