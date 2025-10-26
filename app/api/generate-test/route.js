import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    // If called for explanation only
    if (body.question && body.correctAnswer) {
      const { question, correctAnswer } = body;

      const explanationPrompt = `
Explain briefly and clearly why "${correctAnswer}" is the correct answer to the question:
"${question}"

- Include a factual or educational detail related to the topic, if possible.
- Keep it short and conversational.
- Make it helpful for learning, not just "because it fits."
`;

      const expResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: explanationPrompt }],
        temperature: 0.7,
      });

      const explanation = expResponse.choices[0].message.content.trim();

      return new Response(JSON.stringify({ explanation }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Otherwise: generate full test
    const { topic, difficulty, numQuestions } = body;

    console.log("🎯 Generating test on:", topic, "Difficulty:", difficulty);

    const testPrompt = `
You are TestifyAI — an advanced quiz question generator and teacher.

Your task is to create ${numQuestions} multiple-choice questions about the topic **"${topic}"**.

Follow these rules carefully:

1. **Topic Awareness**
   - The topic above ("${topic}") is what the test should be about.
   - Every question must be directly related to it. If the user gives a sentence, interpret what they want to learn from that sentence and make all questions about that subject.

2. **Difficulty**
   - The difficulty setting is **"${difficulty}"**.
   - If difficulty = "easy", make beginner-level questions.
   - If difficulty = "medium", require moderate reasoning or applied understanding.
   - If difficulty = "hard", make the questions genuinely challenging — like for an expert or master-level learner. These should demand deep understanding, analysis, or specific knowledge.

3. **Questions**
   - Generate ${numQuestions} questions.
   - Each question should have 1 correct and 3 incorrect answers.
   - Do **not** repeat questions in the same test.
   - When generating a new test later, you may reuse similar content but never in the same order.

4. **Answers**
   - Each question must have exactly 4 total answers.
   - Wrong answers should be plausible but clearly incorrect.
   - Correct answers must be factual and unique per question.

5. **Explanation**
   - After identifying the correct answer, give a short, clear explanation (1-2 sentences).
   - The explanation must teach something about the topic — a fact, rule, or reasoning — not just “because it fits.”

6. **Output**
   Return ONLY valid JSON, no text before or after, exactly like this:
   [
     {
       "question": "string",
       "answers": ["A", "B", "C", "D"],
       "correct": "string",
       "explanation": "string"
     }
   ]
`;

    const testResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: testPrompt }],
      temperature: 0.8,
    });

    let content = testResponse.choices[0].message.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const questions = JSON.parse(content);

    // Randomize answer order
    for (const q of questions) {
      q.answers = q.answers.sort(() => Math.random() - 0.5);
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ Error generating test or explanation:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
