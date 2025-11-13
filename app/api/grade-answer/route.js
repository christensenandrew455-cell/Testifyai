import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, question, userAnswer, type } = await req.json();

    if (!["short-answer", "open-response"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "This endpoint only handles short-answer or open-response." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = `
You are TestifyAI, an expert grader. Grade the following student answer based on the question and difficulty level.
Difficulty: ${difficulty}
Question: "${question}"
Student Answer: "${userAnswer}"

Instructions:
- Evaluate if the answer is correct based on the question.
- Provide a simple feedback message explaining why it is correct or incorrect.
- Consider the difficulty level when judging grammar, detail, and completeness.
- Return ONLY valid JSON in this format:

{
  "correct": true or false,
  "feedback": "string"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    if (content.startsWith("```")) content = content.replace(/```(json)?/g, "").trim();

    const gradingResult = JSON.parse(content);

    return new Response(JSON.stringify(gradingResult), {
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
