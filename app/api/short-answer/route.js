import OpenAI from "openai";
import { adminDb } from "@/app/lib/firestoreAdmin";

// ----------------------------------
// REAL FIRESTORE FUNCTIONS
// ----------------------------------
async function getUserData(userId) {
  try {
    const ref = adminDb.doc(`users/${userId}/data/main`);
    const snap = await ref.get();

    if (!snap.exists) return "";

    const d = snap.data();

    // stored as: { raw: "all user data text ..." }
    return d.raw || "";
  } catch (err) {
    console.error("Firestore getUserData error:", err);
    return "";
  }
}

async function getDataSettings(userId) {
  try {
    const ref = adminDb.doc(`users/${userId}`);
    const snap = await ref.get();

    if (!snap.exists) return "chatgpt";

    const d = snap.data();

    // expecting:
    // settings: { method: "chatgpt" | "data" | "both" }
    return d.settings?.method || "chatgpt";
  } catch (err) {
    console.error("Firestore getDataSettings error:", err);
    return "chatgpt";
  }
}

// ----------------------------------
// OPENAI SETUP
// ----------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ----------------------------------
// API ROUTE
// ----------------------------------
export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions = 5, userId } = await req.json();

    // 1. FETCH USER DATA + SETTINGS (REAL FIRESTORE)
    const userData = await getUserData(userId);
    const userSettings = await getDataSettings(userId); 

    let dataInstructions = "";

    // ----------------------------------
    // 2. DETERMINE HOW AI SHOULD USE DATA
    // ----------------------------------
    if (userSettings === "data") {
      dataInstructions = `
Use ONLY the user-provided data below. 
Do NOT use outside information.

User Data:
${userData}
`;
    }

    if (userSettings === "both") {
      dataInstructions = `
Use the user-provided data below FIRST.  
Fill missing gaps with ChatGPT knowledge.

User Data:
${userData}
`;
    }

    if (userSettings === "chatgpt" || !userData || userData.length === 0) {
      dataInstructions = `
Ignore user data. Use ONLY ChatGPT knowledge.
`;
    }

    // ----------------------------------
    // 3. FINAL PROMPT
    // ----------------------------------
    const prompt = `
You are TestifyAI. Generate ${numQuestions} short-answer questions on the topic "${topic}".
Difficulty: ${difficulty}.

${dataInstructions}

Rules:
1. Only output the question text — no answers.
2. Output MUST be valid JSON:
[
  { "question": "string" }
]
`;

    // ----------------------------------
    // 4. OPENAI REQUEST
    // ----------------------------------
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
