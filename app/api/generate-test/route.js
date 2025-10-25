import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, numQuestions } = body;

    console.log("🧠 Generating refined test:", topic, difficulty);

    // 🧩 Updated intelligent prompt based on your new logic
    const prompt = `
You are TestifyAI — an advanced question generator and teacher.

Your job is to create test-style multiple-choice questions based on a topic or sentence the user provides.

Follow these rules carefully:

1. **Understand the topic or sentence deeply.**
   - The user might send a single sentence or a general topic.  
   - You must interpret what they want to learn about and focus your questions on that.

2. **Difficulty levels:**
   - “Easy” should test basic understanding.
   - “Medium” should test applied understanding or interpretation.
   - “Hard” must be genuinely difficult — like a “master” level question requiring detailed knowledge or reasoning.

3. **Question generation:**
   - Generate ${numQuestions} total questions.
   - Each test session must use unique questions and random order.
   - If a user restarts the same topic, it’s okay if some questions are similar — but the **order must be different**.

4. **Answers:**
   - Each question must have exactly **four answer choices**.
   - The answers must not be identical or too similar.
   - Reuse of a previous wrong answer is allowed, but the correct one must always be unique to that question.

5. **Explanation:**
   - For every question, after identifying the correct answer, give a **short, genuine explanation** (2–3 sentences).
   - The explanation should teach something — include a fact or concept that helps the learner understand *why* that answer is correct.
   - Avoid vague reasoning like “because it fits best”; instead, be factual and specific.

6. **Output format:**
   Return ONLY valid JSON in this exact format — no extra commentary:
   [
     {
       "question": "string",
       "answers": ["A", "B", "C", "D"],
       "correct": "string",
       "explanation": "string"
     }
   ]
`;

    // ✉️ Send prompt to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.8,
    });

    // 🧾 Extract and clean JSON
    let content = response.choices[0].message.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const questions = JSON.parse(content);

    // 🔀 Shuffle answer order
    for (const q of questions) {
      q.answers = q.answers.sort(() => Math.random() - 0.5);
    }

    // ✅ Return questions to frontend
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
