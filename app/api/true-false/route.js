import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} TRUE/FALSE questions about "${topic}".
Difficulty: ${difficulty}.

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

Interpret topic EXACTLY as written.

Return ONLY JSON:

[
  {
    "question": "Statement...?",
    "answers": ["True", "False"],
    "correct": "True",
    "explanation": "string"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    let questions = JSON.parse(content);

    questions = questions.map((q, i) => ({
      question: q.question || `Sample statement ${i + 1}\nChoose either True or False below.`,
      answers: ["True", "False"],
      correct: q.correct || "True",
      explanation: q.explanation || "Explanation here."
    }));

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("TF error:", err);
    return new Response(JSON.stringify({ error: "TF generation failed" }), {
      status: 500
    });
  }
}
