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

Rules:
1. Each question must have exactly ${numAnswers} answer options.
2. Each question must have EXACTLY ONE correct answer.
3. Explanation must clearly support the correct answer.
4. Do NOT put letters (A, B, C, D) in the answer text.
5. Return ONLY this JSON format:

[
  {
    "question": "text",
    "answers": ["opt1", "opt2", "opt3", "opt4"],
    "correct": "exact correct answer text",
    "explanation": "reason"
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
      // Normalize answer texts (remove letter prefixes)
      let answers = (q.answers || []).map((a) =>
        normalizeAnswerTextForStorage(a)
      );

      // Ensure number of answers
      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }
      answers = answers.slice(0, numAnswers);

      // --- FIX: Resolve correctText BEFORE shuffle ---
      let correctText = q.correct;

      // If the model returns a number
      if (typeof correctText === "number") {
        correctText = String(q.answers?.[correctText] ?? correctText);
      }
      // If the model returns a letter
      else if (
        typeof correctText === "string" &&
        /^[A-Z]$/i.test(correctText.trim())
      ) {
        const idx = correctText.trim().toUpperCase().charCodeAt(0) - 65;
        correctText = String(q.answers?.[idx] ?? correctText);
      }
      // Otherwise assume it's already the text
      else {
        correctText = String(correctText ?? "");
      }

      // Normalize
      correctText = normalizeAnswerTextForStorage(correctText);

      // Ensure correct text is physically present in answers list
      if (!answers.includes(correctText)) {
        answers[answers.length - 1] = correctText;
      }

      // Shuffle AFTER mapping the correct text
      answers = answers.sort(() => Math.random() - 0.5);

      return {
        question: q.question,
        answers,
        correct: correctText, // <-- ALWAYS correct TEXT
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
