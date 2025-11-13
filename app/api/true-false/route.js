import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} true/false questions on "${topic}".
Difficulty level: ${difficulty}

Rules:
1. Each question has two options: "True" and "False".
2. Only one correct answer per question.
3. Include a one-sentence educational explanation.
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
    content = content.replace(/```(json)?/g, "").trim();
    const questions = JSON.parse(content);

    questions.forEach((q) => {
      if (!q.correct) q.correct = "True";
      if (!q.answers) q.answers = ["True", "False"];
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ True/False generation error:", err);
    const fallback = Array.from({ length: 5 }).map((_, i) => ({
      question: `Sample True/False question ${i + 1} about ${req.topic || "topic"}`,
      answers: ["True", "False"],
      correct: "True",
      explanation: `Explanation for question ${i + 1}.`,
    }));
    return new Response(JSON.stringify({ questions: fallback }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
