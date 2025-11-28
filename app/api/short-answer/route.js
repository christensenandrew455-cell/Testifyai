// app/api/short-answer/route.js
import OpenAI from "openai";
import { adminDb } from "../../lib/firestoreAdmin"; // relative import from api/short-answer -> lib

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// -----------------------------
// Firestore helpers (real reads)
// -----------------------------
async function getUserData(userId) {
  if (!userId) return "";
  try {
    const ref = adminDb.doc(`users/${userId}/data/main`);
    const snap = await ref.get();
    if (!snap.exists) return "";
    const d = snap.data();
    return (d && d.raw) ? d.raw : "";
  } catch (err) {
    console.error("Firestore getUserData error:", err);
    return "";
  }
}

async function getDataSettings(userId) {
  if (!userId) return "chatgpt";
  try {
    const ref = adminDb.doc(`users/${userId}`);
    const snap = await ref.get();
    if (!snap.exists) return "chatgpt";
    const d = snap.data();
    // expects users/{uid}.settings.method = "chatgpt" | "data" | "both"
    return (d && d.settings && d.settings.method) ? d.settings.method : "chatgpt";
  } catch (err) {
    console.error("Firestore getDataSettings error:", err);
    return "chatgpt";
  }
}

// -----------------------------
// API handler
// -----------------------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, numQuestions = 5, userId } = body;

    if (!topic) {
      return new Response(JSON.stringify({ error: "Missing topic" }), { status: 400, headers: { "Content-Type": "application/json" }});
    }

    // Fetch real Firestore data & settings
    const userData = await getUserData(userId);
    const userSettings = await getDataSettings(userId); // "chatgpt" | "data" | "both"

    // If user has no data, force chatgpt-only
    const hasUserData = Boolean(userData && userData.trim().length > 0);
    const finalMode = !hasUserData ? "chatgpt" : userSettings;

    let dataInstructions = "";

    if (finalMode === "data") {
      dataInstructions = `
Use ONLY the user-provided data below. Do NOT use outside information.
User Data:
${userData}
`;
    } else if (finalMode === "both") {
      dataInstructions = `
Use the user-provided data below FIRST. Fill missing gaps with ChatGPT knowledge.
User Data:
${userData}
`;
    } else { // chatgpt
      dataInstructions = `
Ignore user data. Use ONLY ChatGPT knowledge.
`;
    }

    const prompt = `
You are TestifyAI. Generate ${numQuestions} short-answer questions on the topic "${topic}".
Difficulty: ${difficulty}.

${dataInstructions}

Rules:
1. Only output the question text — no answers.
2. Output MUST be valid JSON exactly like:
[
  { "question": "string" }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // parse model output safely
    let content = "";

    try {
      content = response.choices?.[0]?.message?.content?.trim() || "";
      content = content.replace(/```(json)?/g, "").trim();
      const questions = JSON.parse(content);
      return new Response(JSON.stringify({ questions }), { headers: { "Content-Type": "application/json" }});
    } catch (parseErr) {
      console.error("Failed to parse OpenAI output:", parseErr, "raw:", content);
      return new Response(JSON.stringify({ error: "AI returned invalid JSON", raw: content }), { status: 502, headers: { "Content-Type": "application/json" }});
    }
  } catch (err) {
    console.error("Short-answer route error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
}
