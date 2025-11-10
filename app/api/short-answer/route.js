import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { question, userAnswer } = await req.json();

    const prompt = `
You are a teacher AI. Evaluate the user's answer.

Question: "${question}"
User Answer: "${userAnswer}"

- Is the user's answer correct? Respond with true or false.
- Provide a clear, concise explanation (1-2 sentences) of why the answer is correct or incorrect.
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
