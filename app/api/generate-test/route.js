import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, numQuestions } = body;

    console.log("🔍 Environment check:");
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0, 10) + "...");
    console.log("OPENAI_PROJECT_ID:", process.env.OPENAI_PROJECT_ID);
    console.log("OPENAI_ORG_ID:", process.env.OPENAI_ORG_ID);

    const prompt = `
      Create ${numQuestions} multiple-choice questions about ${topic}, 
      difficulty: ${difficulty}. 
      Each question should have one correct answer and three related incorrect ones.
      Return in JSON format:
      [
        {"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}
      ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const questions = JSON.parse(content);

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
