import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { question, userAnswer } = await req.json();

    const prompt = `
You are a teacher AI. Evaluate the user's open response.

Question: "${question}"
User Answer: "${userAnswer}"

- Determine if the answer is correct or partially correct.
- Provide a brief explanation (1-2 sentences) highlighting why it is correct or what is missing.
- Output ONLY valid JSON like this:
{
  "isCorrect": true,
  "explanation": "string"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
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
