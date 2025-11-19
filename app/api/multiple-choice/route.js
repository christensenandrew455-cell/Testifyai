import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Normalize text: remove letter prefixes (A. B) etc.)
function normalizeAnswerTextForStorage(s = "") {
  return String(s).replace(/^[A-Z]\s*[\.\)]\s*/i, "").trim();
}

export async function POST(req) {
  try {
    const {
      topic,
      difficulty,
      numQuestions = 5,
      numAnswers = 4,
    } = await req.json();

    const prompt = `
You are a Test Question Generator. Generate ${numQuestions} MULTIPLE-CHOICE questions about "${topic}".
Difficulty: ${difficulty}.

RULES (IMPORTANT):
1. Each question must have exactly ${numAnswers} answer options.
2. Each question must have EXACTLY ONE correct answer.
3. DO NOT put letters (A, B, C, D) in answer options.
4. The explanation MUST start with this format EXACTLY:

   "Correct Answer: <correct-answer-text>. Reason: <rest of explanation>"

5. JSON output format ONLY:

[
  {
    "question": "text",
    "answers": ["opt1", "opt2", "opt3", "opt4"],
    "correct": "the correct answer text (same as in explanation)",
    "explanation": "Correct Answer: <text>. Reason: <reason>"
  }
]
`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    // Clean content
    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    let questions = JSON.parse(content);

    // Process & fix each question
    questions = questions.map((q) => {
      // Normalize answers
      let answers = (q.answers || []).map((a) =>
        normalizeAnswerTextForStorage(a)
      );

      // Make sure answer count is correct
      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }
      answers = answers.slice(0, numAnswers);

      // --- NEW FIX: Extract correct answer from explanation ---
      const match = q.explanation.match(/Correct Answer:\s*(.*?)\s*\./i);

      let correctText = match ? match[1].trim() : q.correct;

      // Normalize
      correctText = normalizeAnswerTextForStorage(correctText);

      // Ensure the correct answer is in the answers list
      if (!answers.includes(correctText)) {
        answers[answers.length - 1] = correctText;
      }

      // Shuffle
      answers = answers.sort(() => Math.random() - 0.5);

      return {
        question: q.question,
        answers,
        correct: correctText,
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
