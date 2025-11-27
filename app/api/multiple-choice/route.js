import OpenAI from "openai";
import { getUserData } from "../../lib/firestore";
import { getServerSession } from "next-auth";  // ⬅️ REQUIRED (if using next-auth)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    // --------------------------
    // 1. GET USER + THEIR DATA
    // --------------------------
    const session = await getServerSession();
    const uid = session?.user?.id || null;

    let userData = null;

    if (uid) {
      userData = await getUserData(uid);
    }

    // If user has no stored data
    const rawData = userData?.raw || "";

    // --------------------------
    // 2. DATA RELEVANCY CHECK
    // --------------------------
    let shouldUseData = false;

    if (rawData && typeof rawData === "string") {
      const lowerRaw = rawData.toLowerCase();
      const lowerTopic = topic.toLowerCase();

      // Basic topic match detection
      if (
        lowerRaw.includes(lowerTopic) ||
        lowerTopic.includes("my data") ||
        lowerTopic.includes("my info") ||
        lowerTopic.includes("based on my") ||
        lowerTopic.includes("from my")
      ) {
        shouldUseData = true;
      }
    }

    // --------------------------
    // 3. BUILD THE PROMPT
    // --------------------------

    const dataSection = shouldUseData
      ? `
User Data Context:
------------------
${rawData}

Use this data ONLY when creating the questions.`
      : `
The user has NO relevant data OR the topic does not relate to their stored data.
Do NOT reference any user data.`;

    const prompt = `

${dataSection}

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
      temperature: 0.6
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    let questions = JSON.parse(content);

    // --------------------------
    // 5. CLEANUP & VALIDATION
    // --------------------------
    questions = questions.map((q, i) => {
      let answers = Array.from(new Set(q.answers || []));

      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }

      answers = answers.slice(0, numAnswers);

      if (!answers.includes(q.correct)) {
        answers[answers.length - 1] = q.correct;
      }

      answers = answers.sort(() => Math.random() - 0.5);

      return {
        question: q.question,
        answers,
        correct: q.correct, // never modify correct answer text
        explanation: q.explanation
      };
    });

    return new Response(JSON.stringify({ questions, usedData: shouldUseData }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("MC error:", err);
    return new Response(JSON.stringify({ error: "MC generation failed" }), {
      status: 500
    });
  }
}
