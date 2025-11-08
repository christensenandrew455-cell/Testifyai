import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions } = await req.json();

    const prompt = `
You are TestifyAI — generate ${numQuestions} true/false questions on the topic "${topic}".

Rules:
1. Each question must have exactly two answers: "True" and "False".
2. Only one correct answer per question.
3. Include a one-sentence educational explanation for why the correct answer is correct.
4. Output ONLY valid JSON like this:
[
  {
    "question": "string",
    "answers": ["True", "False"],
    "correct": "True",
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

