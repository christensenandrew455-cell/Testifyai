import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    const prompt = `
You are a Test Question Generator.

You MUST generate each question using this pipeline:

STEP 1 — Make the question.
STEP 2 — Make answer choices (ONLY 1 correct).
STEP 3 — Write a detailed explanation.
STEP 4 — From the explanation, EXTRACT the correct answer text.
STEP 5 — Use that extracted answer text as the "correct" field in JSON.

### IMPORTANT RULES
- The explanation MUST contain the correct answer clearly inside the first sentence.
- Example: "The correct answer is oxygen because plants release oxygen..."
- You MUST pull the correct answer from the explanation, not from memory.
- The "correct" field in JSON must contain ONLY the exact answer text (few words).
- The answer choices MUST NOT contain the explanation text.
- NEVER insert full explanation sentences inside answer options.
- Output ONLY JSON.

### OUTPUT FORMAT (ONLY JSON)
[
  {
    "question": "What is ...?\\nChoose one of the answers below.",
    "answers": ["ans1", "ans2", "ans3", "ans4"],
    "correct": "extracted correct answer",
    "explanation": "The correct answer is ____ because ____."
  }
]

Generate exactly ${numQuestions} questions about "${topic}" at difficulty "${difficulty}".
All questions must strictly follow Steps 1–5.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    // GPT NOW handles correct answer extraction itself
    let questions = JSON.parse(content);

    // Light cleanup: ensure number of answers + shuffle
    questions = questions.map((q) => {
      let answers = Array.from(new Set(q.answers || []));

      while (answers.length < numAnswers) {
        answers.push(`Option ${answers.length + 1}`);
      }

      answers = answers.slice(0, numAnswers);

      // Make sure correct stays included
      if (!answers.includes(q.correct)) {
        answers[answers.length - 1] = q.correct;
      }

      answers = answers.sort(() => Math.random() - 0.5);

      return {
        question: q.question,
        answers,
        correct: q.correct,
        explanation: q.explanation,
      };
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("MC error:", err);
    return new Response(JSON.stringify({ error: "MC generation failed" }), {
      status: 500,
    });
  }
}
