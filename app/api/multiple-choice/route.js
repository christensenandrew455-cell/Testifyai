import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 4 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} multiple-choice questions about "${topic}".
Difficulty: ${difficulty}.

Rules:
1. Each question must have exactly ${numAnswers} unique answer options labeled A, B, C, D, etc.
2. Each question must have exactly ONE correct answer.
3. Provide a short, one-sentence educational explanation for each question.
4. Output ONLY valid JSON, like this:

[
  {
    "question": "string",
    "answers": ["string", "string", "string", "string"],
    "correct": "string",
    "explanation": "string"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```(json)?/g, "").trim();

    let questions = JSON.parse(content);

    // ✅ Post-processing to ensure clean structure
    questions = questions.map((q, i) => {
      let answers = Array.from(new Set(q.answers || []));
      if (answers.length < numAnswers) {
        const needed = numAnswers - answers.length;
        for (let j = 0; j < needed; j++) {
          answers.push(`Extra option ${j + 1}`);
        }
      }

      // ensure correct answer exists in answers
      let correct = q.correct;
      if (!answers.includes(correct)) {
        correct = answers[0]; // fallback to first
      }

      // shuffle answers *after* we confirm correct exists
      answers = answers.sort(() => Math.random() - 0.5);

      return {
        question: q.question || `Sample question ${i + 1} about ${topic}`,
        answers,
        correct,
        explanation:
          q.explanation ||
          "This question helps reinforce your understanding of the topic.",
      };
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Multiple-choice generation error:", err);
    const fallback = Array.from({ length: 5 }).map((_, i) => ({
      question: `Sample multiple-choice question ${i + 1} about topic`,
      answers: ["Option A", "Option B", "Option C", "Option D"],
      correct: "Option A",
      explanation: `Explanation for question ${i + 1}.`,
    }));
    return new Response(JSON.stringify({ questions: fallback }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
