import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} TRUE/FALSE questions about "${topic}".
Difficulty: ${difficulty}.

IMPORTANT:
Interpret the topic EXACTLY as written. 
Do NOT reinterpret or rewrite the topic.
If the topic is broad or ambiguous, generate questions that stay strictly within the words the user provided.
Example: 
- “learning psychology” = the psychology of how people learn, memory, motivation, cognitive processes, etc.

Each question MUST include at the top:
"Choose either True or False below."

Output ONLY JSON:

[
  {
    "question": "Choose either True or False below.\\nStatement...",
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
      question:
        q.question ||
        `Choose either True or False below.\nSample True/False question ${i + 1}`,
      answers: ["True", "False"],
      correct: q.correct || "True",
      explanation: q.explanation || "This explanation supports why the answer is correct."
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
