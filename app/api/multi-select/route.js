import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, numAnswers = 5 } = await req.json();

    const prompt = `
You are TestifyAI. Generate ${numQuestions} MULTI-SELECT questions about "${topic}".
Difficulty: ${difficulty}.

Difficulty scale (1–9):
1 = easy easy, 
2 = medium easy, 
3 = hard easy, 
4 = easy medium, 
5 = medium medium, 
6 = hard medium, 
7 = easy hard, 
8 = medium hard, 
9 = hard hard

INTERPRET THE TOPIC EXACTLY AS WRITTEN.
Do NOT change or reinterpret the topic.
If the topic is broad or unclear, stay strictly inside the literal meaning.

Rules:
1. Each question must have EXACTLY ${numAnswers} answer options.
2. Each question must have 2–5 correct answers. 
3. The number of answers for each question should be RANDOM.
4. Correct answers must logically fit the question.
5. Explanations MUST match the correct answers.

Return ONLY VALID JSON, like:

[
  {
    "question": "What is ...?",
    "answers": ["A", "B", "C", "D", "E"],
    "correct": ["A", "C"],
    "explanation": "string"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "").trim();

    let questions = JSON.parse(content);

    // Ensure valid answers + corrects
    questions = questions.map((q, i) => {
      let answers = Array.from(new Set(q.answers || []));
      while (answers.length < numAnswers) {
        answers.push(`Extra option ${answers.length + 1}`);
      }
      answers = answers.slice(0, numAnswers);

      let correct = (q.correct || []).filter(a => answers.includes(a));

      if (correct.length < 2) {
        correct.push(answers[0], answers[1]);
      }
      correct = correct.slice(0, 5);

      return {
        question: q.question || `Sample question ${i + 1} about ${topic}\nChoose between 2–5 possible answers below.`,
        answers,
        correct,
        explanation: q.explanation || "Relevant explanation."
      };
    });

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("MULTI error:", err);
    return new Response(JSON.stringify({ error: "Multi-select generation failed" }), {
      status: 500
    });
  }
}
