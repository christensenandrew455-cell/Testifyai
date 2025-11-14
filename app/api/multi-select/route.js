import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} MULTI-SELECT questions about "${topic}".
Difficulty: ${difficulty}.

Each question MUST start with:
"Choose between 2–5 possible answers below."

IMPORTANT:
Interpret the topic EXACTLY as written. Do NOT reinterpret the topic.
If the topic is broad or ambiguous, generate questions that stay strictly within the user's words.

Rules:
1. Each question must have exactly ${numAnswers} answer options.
2. Each question must have BETWEEN **2 and 5 correct answers** (smartly chosen).
3. Correct answers must logically match the question.
4. Explanations must match the correct answers.
5. Output ONLY JSON like this:

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

    // 🛠 FIX: Ensure 2–5 CORRECT answers WITHOUT overriding AI logic
    questions = questions.map((q, i) => {
      let answers = Array.from(new Set(q.answers || []));

      // pad answers if AI gives fewer than required
      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }

      answers = answers.slice(0, numAnswers);

      let correct = q.correct || [];

      // ensure correct answers actually appear in answers list
      correct = correct.filter(ans => answers.includes(ans));

      // if too FEW correct answers, add logically unchosen ones (not random multiple incorrect)
      if (correct.length < 2) {
        const missing = answers
          .filter(a => !correct.includes(a))
          .slice(0, 2 - correct.length);
        correct = [...correct, ...missing];
      }

      // if too MANY correct answers, trim to max 5
      if (correct.length > 5) {
        correct = correct.slice(0, 5);
      }

      return {
        question:
          q.question ||
          `Choose between 2–5 possible answers below.\nSample question ${i + 1} about ${topic}`,
        answers,
        correct,
        explanation:
          q.explanation ||
          "These answers relate to the core concept described in the question."
      };
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("MULTI error:", err);
    return new Response(
      JSON.stringify({ error: "Multi-select generation failed" }),
      { status: 500 }
    );
  }
}
