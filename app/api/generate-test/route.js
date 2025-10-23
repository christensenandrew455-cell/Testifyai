import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, numQuestions } = body;

    console.log("🔍 Generating test:", topic, difficulty);

    const prompt = `
You are a test question generator. 
Generate ${numQuestions} multiple-choice questions about "${topic}" at ${difficulty} difficulty.
Each question must have:
- one correct answer
- three incorrect but related answers
- all answers should be short and clear
Return ONLY valid JSON in this exact format:

[
  {
    "question": "What is ...?",
    "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
    "correct": "Answer 1"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Extract and parse AI response
    let content = response.choices[0].message.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const questions = JSON.parse(content);

    // Shuffle answer order for each question
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
