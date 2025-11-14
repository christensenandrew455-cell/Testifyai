import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} MULTIPLE-CHOICE questions about "${topic}".
Difficulty: ${difficulty}.

Format each question like:
"Question text...?
Choose one of the answers below."

INTERPRET THE TOPIC EXACTLY AS WRITTEN.

Rules:
1. EXACTLY ${numAnswers} answer options.
2. EXACTLY ONE correct answer.
3. Explanations must justify the correct answer.

Return ONLY JSON:

[
  {
    "question": "What is ...?\\nChoose one of the answers below.",
    "answers": ["A", "B", "C", "D"],
    "correct": "A",
    "explanation": "string"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    let questions = JSON.parse(content);

    questions = questions.map((q, i) => {
      let answers = Array.from(new Set(q.answers || []));
      while (answers.length < numAnswers) answers.push(`Extra option ${answers.length + 1}`);
      answers = answers.slice(0, numAnswers).sort(() => Math.random() - 0.5);

      const correct = answers.includes(q.correct) ? q.correct : answers[0];

      return {
        question: q.question || `Sample question ${i + 1}\nChoose one of the answers below.`,
        answers,
        correct,
        explanation: q.explanation || "Explanation here."
      };
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("MC error:", err);
    return new Response(JSON.stringify({ error: "MC generation failed" }), {
      status: 500
    });
  }
}
