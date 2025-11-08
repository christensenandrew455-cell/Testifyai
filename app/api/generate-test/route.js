import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, numQuestions } = body;

    if (!topic || !numQuestions || !difficulty) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("🎯 Base test generation request:", topic, "Difficulty:", difficulty);

    // Base prompt for now — returns placeholder JSON structure
    const basePrompt = `
Generate ${numQuestions} generic questions on the topic "${topic}" with difficulty ${difficulty}.
Do NOT specify test type yet — just return a placeholder structure like this:

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
      messages: [{ role: "user", content: basePrompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const questions = JSON.parse(content);

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in base API:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
