import OpenAI from "openai";
import { getUserData } from "../../lib/firestore";
import { getServerSession } from "next-auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    // --------------------------
    // 1. GET USER + THEIR DATA
    // --------------------------
    const session = await getServerSession();
    const uid = session?.user?.uid || session?.user?.id || null;

    let userData = uid ? await getUserData(uid) : null;
    let aiAccess = userData?.aiAccess || "both";

    // Use formatted first, fall back to raw
    let userText = userData?.formatted?.trim() || userData?.raw?.trim() || "";

    // --------------------------
    // 2. DECIDE DATA USAGE
    // --------------------------
    let promptDataSection = "";
    if (aiAccess === "data-only") {
      if (!userText) {
        return new Response(
          JSON.stringify({ error: "No user data available to generate questions." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      promptDataSection = `Use ONLY the following user-imported data to generate questions:\n${userText}`;
    } else if (aiAccess === "chatgpt-only") {
      promptDataSection = `Do NOT use any user-imported data. Use only your general knowledge to generate questions about "${topic}".`;
    } else if (aiAccess === "both") {
      promptDataSection = userText
        ? `Use the following user-imported data as primary source, but supplement with your general knowledge if needed:\n${userText}`
        : `User has no imported data. Use your general knowledge to generate questions about "${topic}".`;
    }

    // --------------------------
    // 3. BUILD PROMPT
    // --------------------------
    const prompt = `
${promptDataSection}

You are a test question generator.

Generate ${numQuestions} MULTIPLE-CHOICE questions about "${topic}".
Difficulty: ${difficulty}.

Difficulty scale (1–9):
1 = Easy / Very Simple
2 = Easy / Slightly Challenging
3 = Easy / Hard
4 = Medium / Easy
5 = Medium / Medium
6 = Medium / Hard
7 = Hard / Easy
8 = Hard / Medium
9 = Hard / Very Hard

For EACH question, follow this EXACT process:

1. Generate a question.
2. Generate a detailed explanation that contains the correct answer clearly inside the explanation.
3. From that explanation, EXTRACT the exact correct answer text.
4. Use that extracted text as the "correct" field.
5. Generate ${numAnswers - 1} WRONG answers that are:
   - similar in length
   - believable
   - NOT obviously wrong
   - NOT duplicates of each other or the correct answer.

FORMAT STRICTLY AS JSON ONLY:

[
  {
    "question": "Question text...?",
    "answers": ["answer A", "answer B", "answer C", "answer D"],
    "correct": "The EXACT correct answer text extracted from the explanation",
    "explanation": "Full explanation containing the correct answer"
  }
]

RULES:
- Do NOT include letters (A, B, C, D) in the answer text.
- Each question MUST have exactly ${numAnswers} answer options.
- The explanation MUST clearly support and contain the correct answer.
- The correct answer MUST appear in the answers array EXACTLY as extracted.
- Return ONLY valid JSON. No text outside the JSON.
`;

    // --------------------------
    // 4. CALL OPENAI
    // --------------------------
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    let content = response.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("OpenAI returned empty content");

    content = content.replace(/```json|```/g, "").trim();

    // --------------------------
    // 5. PARSE AND VALIDATE
    // --------------------------
    let questions = [];
    try {
      questions = JSON.parse(content);
    } catch (err) {
      console.error("JSON parse error:", err, "Content:", content);
      throw new Error("Invalid JSON from OpenAI");
    }

    questions = questions.map((q) => {
      let answers = Array.from(new Set(q.answers || []));
      while (answers.length < numAnswers) answers.push(`Extra option ${answers.length + 1}`);
      answers = answers.slice(0, numAnswers);
      if (!answers.includes(q.correct)) answers[answers.length - 1] = q.correct;
      answers = answers.sort(() => Math.random() - 0.5);
      return { question: q.question, answers, correct: q.correct, explanation: q.explanation };
    });

    return new Response(
      JSON.stringify({ questions, usedData: aiAccess !== "chatgpt-only" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("MC error:", err);
    return new Response(
      JSON.stringify({ error: "MC generation failed", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
