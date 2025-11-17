import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    const prompt = `
You are Test question generater Generate ${numQuestions} MULTIPLE-CHOICE questions about "${topic}".
Difficulty: ${difficulty}.

Format each question like:
"Question text...?
Choose one of the answers below."

Rules:
1. Each question must have exactly ${numAnswers} answer options
2. Each question must have EXACTLY ONE correct answer.
3. The explanation MUST clearly support the correct answer.
4. The explanation must contain the correct answer text exactly once.
5. If the explanation does not match the correct answer, regenerate that question.
6. Output ONLY JSON like this:

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

      // Ensure total number of answers
      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }

      answers = answers.slice(0, numAnswers);

      // FIX: Make sure correct answer is actually in the list
      if (!answers.includes(q.correct)) {
        // Replace LAST answer so we do NOT overwrite any valid options
        answers[answers.length - 1] = q.correct;
      }

      // FIX: Shuffle while preserving correct answer
      answers = answers.sort(() => Math.random() - 0.5);

      // FIX: Keep correct answer EXACTLY as ChatGPT generated it
      const correct = q.correct;

      // FIX: Keep explanation EXACTLY as generated
      const explanation = q.explanation;

      return {
        question: q.question || `Sample question ${i + 1}\nChoose one of the answers below.`,
        answers,
        correct,
        explanation
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
