// app/api/datafix/route.js
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { data } = await req.json();

    if (!data || data.trim() === "") {
      return new Response(JSON.stringify({ error: "No data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
You are TestifyAI. Organize the following data into clear, readable sections. 
- Make it easier to understand.
- Shorten sentences where possible and use better words.
- Keep the meaning the same.
- Add sections with titles if appropriate, like "Key Points", "Details", "Summary".
- Use bullet points, numbered lists, or headings where it helps readability.

Data:
${data}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    let processedData = response.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ processedData }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Datafix error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
