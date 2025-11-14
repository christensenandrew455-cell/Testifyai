import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} MULTIPLE-CHOICE questions about "${topic}".
Difficulty: ${difficulty}.

Each question MUST include at the top:
"Choose one of the answers below."

IMPORTANT:
Interpret the topic EXACTLY as written. 
Do NOT reinterpret or rewrite the topic.
If the topic is broad or ambiguous, generate questions that stay strictly within the words the user provided.
Example: 
- “learning psychology” = the psychology of how people learn, memory, motivation, cognitive processes, etc.

Rules:
1. Each question must have exactly ${numAnswers} unique answer options (A, B, C, D, etc.)
2. Each question must have EXACTLY ONE correct answer.
3. The explanation MUST clearly support the correct answer.
4. Output ONLY JSON like this:

[
  {
    "question": "Choose one of the answers below.\\nWhat is ...?",
    "answers": ["string", "string", "string", "string"],
    "correct": "string",
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

    // 🛠 Fix structure
    questions = questions.map((q, i) => {
      let answers = Array.from(new Set(q.answers || []));
      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }

      // Make sure correct answer exists
      let correct = answers.includes(q.correct) ? q.correct : answers[0];

      // Shuffle answers
      answers = answers.sort(() => Math.random() - 0.5);

      return {
        question: q.question || `Choose one of the answers below.\nSample question ${i + 1} about ${topic}`,
        answers,
        correct,
        explanation:
          q.explanation || "This explanation supports why the correct answer is correct."
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
