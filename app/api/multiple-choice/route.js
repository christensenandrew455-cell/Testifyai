import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Pull correct answer out of explanation reliably
function extractCorrectFromExplanation(explanation = "") {
  explanation = explanation.trim();

  // Pattern: "**Correct Answer:** XYZ"
  let match = explanation.match(/\*\*?Correct Answer\*\*?\s*:\s*(.+)/i);
  if (match) return match[1].trim();

  // Pattern: "The correct answer is XYZ"
  match = explanation.match(/correct answer is\s+([^\.]+)/i);
  if (match) return match[1].trim();

  // Pattern: "Because XYZ is ..." → take first noun phrase
  match = explanation.match(/^(.+?)\s+(is|because|since)/i);
  if (match) return match[1].trim();

  // Fallback: first 6 words
  return explanation.split(" ").slice(0, 6).join(" ").trim();
}

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } =
      await req.json();

    const prompt = `
You are a test question generator. Produce ${numQuestions} MULTIPLE-CHOICE questions about "${topic}".
Difficulty: ${difficulty}.

Each question must include:
- "question": string
- "answers": array of ${numAnswers} items
- "correct": ALWAYS repeat the exact correct answer text
- "explanation": MUST clearly state the correct answer (e.g., "The correct answer is ____ because...")

Do NOT label answers with letters.

Return ONLY valid JSON:

[
  {
    "question": "text",
    "answers": ["opt1", "opt2", "opt3", "opt4"],
    "correct": "correct answer text",
    "explanation": "reason"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    let questions = JSON.parse(content);

    // --- MAIN FIX: We IGNORE q.correct and re-derive it from the explanation ---
    questions = questions.map((q) => {
      let explanationCorrect = extractCorrectFromExplanation(q.explanation || "");

      let answers = Array.from(new Set(q.answers || []));

      // Fill missing answers
      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }
      answers = answers.slice(0, numAnswers);

      // Make sure the extracted correct answer is present
      if (!answers.includes(explanationCorrect)) {
        answers[answers.length - 1] = explanationCorrect;
      }

      // Shuffle
      answers = answers.sort(() => Math.random() - 0.5);

      return {
        question: q.question,
        answers,
        correct: explanationCorrect, // ← FINAL SOURCE OF TRUTH
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
