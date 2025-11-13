import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} *multi-select* questions about "${topic}".
Difficulty level: ${difficulty}.

Rules:
1. Each question must have exactly ${numAnswers} unique answer options labeled A, B, C, D, E, F, etc.
2. Each question must have between 2 and 5 correct answers (random number in that range).
3. The incorrect answers must be clearly wrong or misleading.
4. Include a one-sentence educational explanation for each question.
5. Output ONLY valid JSON with this format:

[
  {
    "question": "string",
    "answers": ["Option A", "Option B", "Option C", "Option D"],
    "correct": ["Option A", "Option D"],
    "explanation": "string"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```(json)?/g, "").trim();

    let questions = JSON.parse(content);

    // ✅ Post-processing to ensure valid structure
    questions = questions.map((q, i) => {
      const uniqueAnswers = Array.from(new Set(q.answers || []));
      let correctAnswers = (q.correct || []).filter((ans) =>
        uniqueAnswers.includes(ans)
      );

      // Enforce between 2 and 5 correct answers
      if (correctAnswers.length < 2) {
        // Add a few random corrects
        const extra = uniqueAnswers
          .filter((a) => !correctAnswers.includes(a))
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.max(2 - correctAnswers.length, 0));
        correctAnswers = [...correctAnswers, ...extra];
      } else if (correctAnswers.length > 5) {
        correctAnswers = correctAnswers.slice(0, 5);
      }

      return {
        question: q.question || `Question ${i + 1} about ${topic}`,
        answers: uniqueAnswers.sort(() => Math.random() - 0.5),
        correct: correctAnswers,
        explanation:
          q.explanation || "This question demonstrates a key concept about the topic.",
      };
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Multi-select generation error:", err);
    const fallback = Array.from({ length: 5 }).map((_, i) => ({
      question: `Sample multi-select question ${i + 1} about topic`,
      answers: ["Option A", "Option B", "Option C", "Option D"],
      correct: ["Option A", "Option C"],
      explanation: `Explanation for question ${i + 1}.`,
    }));
    return new Response(JSON.stringify({ questions: fallback }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
