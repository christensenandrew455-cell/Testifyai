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

Difficulty scale (1–9):
1 = Easy / Very Simple
2 = Easy / Slightly Challenging
3 = Easy / Hard
4 = Medium / Easy
5 = Medium / Medium
6 = Medium / Hard
7 = Hard / Easy
8 = Hard / Medium
9 = Hard / Very Hard
`;

Instructions:
- Evaluate if the answer is correct based on the question.
- Consider the difficulty level when judging grammar, detail, and completeness.
- Provide a short feedback explanation of why the answer is correct or incorrect and what the answer acually is.
- Return ONLY valid JSON in this exact format:
{
  "question": "string",     // repeat the original question
  "studentAnswer": "string", // repeat the student's answer
  "correct": true or false,  // true if correct, false if not
  "feedback": "string"       // explanation of why it is correct or incorrect
}
- Do not include anything outside of this JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    // Remove any JSON code fences just in case
    if (content.startsWith("```")) content = content.replace(/```(json)?/g, "").trim();

    // Safely parse JSON, with a fallback
    let gradingResult;
    try {
      gradingResult = JSON.parse(content);
    } catch (err) {
      console.error("❌ Failed to parse JSON from AI:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI grading response." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(gradingResult), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Grade-answer error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
