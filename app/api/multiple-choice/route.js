import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    const prompt = `
You are a test question generator.

Generate ${numQuestions} MULTIPLE-CHOICE questions about "${topic}".
Difficulty: ${difficulty}.

For EACH question, follow this EXACT process:

1. Generate a question WITHOUT adding any extra text like “Choose one of the answers below.” 
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
    "question": "Actual question text ONLY.",
    "answers": ["answer A", "answer B", "answer C", "answer D"],
    "correct": "Exact correct answer text",
    "explanation": "Full explanation containing the correct answer"
  }
]

RULES:
- Do NOT include letters (A, B, C, etc) in the answer text.
- Each question MUST have exactly ${numAnswers} answer options.
- The explanation MUST clearly support and contain the correct answer.
- The correct answer MUST appear in the answers array EXACTLY as extracted.
- Return ONLY valid JSON. No text outside the JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    let questions = JSON.parse(content);

    questions = questions.map((q) => {
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
        question: q.question.replace(/Choose one of the answers below\.?/i, "").trim(),
        answers,
        correct: q.correct,
        explanation: q.explanation,
        
        // 🔥 SEND THIS SO NEXT PAGE KNOWS HOW MANY ANSWERS THERE ARE
        numAnswers
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
