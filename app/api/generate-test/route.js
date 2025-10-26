import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    // 📘 If called only for explanation
    if (body.question && body.correctAnswer) {
      const { question, correctAnswer } = body;

      const explanationPrompt = `
Explain clearly and briefly (1-2 sentences) why "${correctAnswer}" is the correct answer to the question:
"${question}"

- Include a useful fact or concept that helps the learner understand why it's right.
- Make it sound natural, like a teacher explaining.
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

    // 📘 Otherwise: full test generation
    const { topic, difficulty, numQuestions } = body;

    console.log("🎯 Generating test on:", topic, "Difficulty:", difficulty);

    const testPrompt = `
You are TestifyAI — an advanced quiz generator.

Create ${numQuestions} multiple-choice questions on the topic **"${topic}"**.

Follow these rules:

1. **Topic Focus**
   - All questions must directly relate to "${topic}".

2. **Difficulty (Scale 1–9)**
   - Difficulty = ${difficulty}.
   - 1–2 → absolute beginner (knows almost nothing; use simple facts).
   - 3–4 → novice (has heard of the topic but not much else).
   - 5–6 → intermediate (knows the basics; add reasoning or examples).
   - 7–8 → advanced (knows most concepts; test applied understanding).
   - 9 → master/expert (graduate-level or professional; deep analytical or specialized questions).

3. **Questions**
   - Create ${numQuestions} unique questions.
   - Each must have exactly 4 total answers.
   - Include 1 correct and 3 incorrect but plausible options.

4. **Answers**
   - Mix factual recall, understanding, and reasoning questions.
   - Do not make two answers too similar.

5. **Explanation**
   - Add a one-sentence educational explanation for why the correct answer is right.

6. **Output**
   Return ONLY valid JSON like this:
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

    // Shuffle answers
    for (const q of questions) {
      q.answers = q.answers.sort(() => Math.random() - 0.5);
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error generating test:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
