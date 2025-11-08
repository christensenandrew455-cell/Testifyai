import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, type } = await req.json();

    if (!["short-answer", "open-response"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "This endpoint only handles short-answer or open-response." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = `
You are TestifyAI — generate 1 ${type === "short-answer" ? "short answer" : "open response"} question on the topic "${topic}".
Difficulty level: ${difficulty}.
Return ONLY JSON in this format:
{
  "question": "string"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    if (content.startsWith("```")) content = content.replace(/```(json)?/g, "").trim();

    const questionData = JSON.parse(content);

    return new Response(JSON.stringify(questionData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
