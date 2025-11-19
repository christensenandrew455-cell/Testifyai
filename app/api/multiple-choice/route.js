import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Extract a SHORT correct answer from the explanation
function extractShortCorrectAnswer(explanation = "") {
  if (!explanation) return "";

  let text = explanation.replace(/\n/g, " ").trim();

  // --- 1. Look for direct "Correct answer is X" ---
  let match = text.match(/correct answer is\s+(.+?)(?:,|\.| because| since| due to|$)/i);
  if (match) return match[1].trim();

  // --- 2. Look for "**Correct Answer:** X" ---
  match = text.match(/\*\*?correct answer\*\*?\s*:\s*(.+?)(?:,|\.| because| since| due to|$)/i);
  if (match) return match[1].trim();

  // --- 3. Otherwise take the first small noun phrase (avoid long text) ---
  match = text.match(/^(.+?)(?:,|\.| because| since| due to|$)/i);
  if (match) {
    let candidate = match[1].trim();
    // Limit to 7 words max so explanation never becomes an answer
    return candidate.split(" ").slice(0, 7).join(" ").trim();
  }

  // Backup: first 3 words
  return text.split(" ").slice(0, 3).join(" ").trim();
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
- "correct": EXACT short correct answer text
- "explanation": must clearly contain the correct answer

Do NOT add letters (A, B, C, D).
Return ONLY JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    let questions = JSON.parse(content);

    questions = questions.map((q) => {
      let answers = Array.from(new Set(q.answers || []));

      // Short clean correct answer from explanation
      let realCorrect = extractShortCorrectAnswer(q.explanation || "");

      // Fill if missing
      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }
      answers = answers.slice(0, numAnswers);

      // Ensure correct answer is included
      if (!answers.includes(realCorrect)) {
        answers[answers.length - 1] = realCorrect;
      }

      // Shuffle
      answers = answers.sort(() => Math.random() - 0.5);

      return {
        question: q.question,
        answers,
        correct: realCorrect,
        explanation: q.explanation,
      };
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" }),
    });

  } catch (err) {
    console.error("MC error:", err);
    return new Response(JSON.stringify({ error: "MC generation failed" }), {
      status: 500,
    });
  }
}
