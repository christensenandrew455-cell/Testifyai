import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { rawData } = await req.json();

    if (!rawData || rawData.trim() === "") {
      return new Response(JSON.stringify({ error: "No data provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
You are TestifyAI. Organize the following raw data into well-structured sections.
- Make it easy to read
- Keep the meaning the same
- Shorten long sentences
- Use better wording where possible
- Keep the content fully understandable

Raw data:
"""
${rawData}
"""

Output the result as plain text.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let organizedData = response.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ organizedData }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ DataFix error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to process data." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
