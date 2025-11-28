import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, userId } = await req.json();

    // -----------------------------
    // 1. GET USER DATA + SETTINGS
    // -----------------------------
    const userData = await getUserData(userId); 
    const userSettings = await getDataSettings(userId); // "chatgpt" | "data" | "both"

    // userData = array of strings or combined text
    // userSettings = userPreference.method

    let dataInstructions = "";

    // -----------------------------
    // 2. APPLY DATA SETTINGS
    // -----------------------------
    if (userSettings === "data") {
      dataInstructions = `
Use ONLY the user-provided data below. 
DO NOT use any outside information or ChatGPT knowledge.

User Data:
${userData}
`;
    }

    if (userSettings === "both") {
      dataInstructions = `
Use the user-provided data below FIRST.
Fill any missing gaps with ChatGPT knowledge.

User Data:
${userData}
`;
    }

    if (userSettings === "chatgpt" || !userData || userData.length === 0) {
      dataInstructions = `
Ignore user data (if any). Use ONLY ChatGPT knowledge.
`;
    }

    // -----------------------------
    // 3. BUILD FINAL PROMPT
    // -----------------------------
    const prompt = `
You are TestifyAI. Generate ${numQuestions} short-answer questions on the topic "${topic}".
Difficulty level: ${difficulty}.

${dataInstructions}

Difficulty scale (1–9):
1=Easy Simple, 2=Easy Challenging, 3=Easy Hard,
4=Medium Easy, 5=Medium Medium, 6=Medium Hard,
7=Hard Easy, 8=Hard Medium, 9=Hard Very Hard

Rules:
1. Only output the question text — no answers.
2. Output MUST be valid JSON like:
[
  { "question": "string" }
]
`;

    // -----------------------------
    // 4. SEND OPENAI REQUEST
    // -----------------------------
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    content = content.replace(/```(json)?/g, "").trim();
    const questions = JSON.parse(content);

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Short-answer generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// -----------------------------
// Helper functions (you replace with DB)
// -----------------------------
async function getUserData(userId) {
  // TODO: Replace this with your DB query
  // Return all combined text data for that user
  return "Example user data goes here";
}

async function getDataSettings(userId) {
  // TODO: Replace this with your DB query
  // Must return: "chatgpt" | "data" | "both"
  return "both";
}
