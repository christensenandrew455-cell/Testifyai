import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} MULTI-SELECT questions about "${topic}".
Difficulty: ${difficulty}.

Each question MUST include at the top:
"Choose between 2–5 possible answers below."

IMPORTANT:
Interpret the topic EXACTLY as written. 
Do NOT reinterpret or rewrite the topic.
If the topic is broad or ambiguous, generate questions that stay strictly within the words the user provided.
Example: 
- “learning psychology” = the psychology of how people learn, memory, motivation, cognitive processes, etc.

Rules:
1. Each question must have exactly ${numAnswers} answer options.
2. Each question must have a RANDOM number of correct answers (between 2 and 5).
3. Explanations must match the correct answers.
4. Output ONLY JSON in this format:

[
  {
    "question": "Choose between 2–5 possible answers below.\\nWhat is ...?",
    "answers": ["A", "B", "C", "D", "E"],
    "correct": ["A", "C"],
    "explanation": "string"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();
    let questions = JSON.parse(content);

    // 🛠 Fix structure + random correct count
    questions = questions.map((q, i) => {
      const answers = Array.from(new Set(q.answers || [])).slice(0, numAnswers);

      // random correct amount
      const numCorrect = Math.floor(Math.random() * 4) + 2; // 2–5
      let correct = answers
        .sort(() => Math.random() - 0.5)
        .slice(0, numCorrect);

      return {
        question: q.question || `Choose between 2–5 possible answers below.\nSample question ${i + 1} about ${topic}`,
        answers,
        correct,
        explanation: q.explanation || "These answers relate to the core concept."
      };
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("MULTI error:", err);
    return new Response(JSON.stringify({ error: "Multi-select generation failed" }), {
      status: 500
    });
  }
}
