import OpenAI from "openai";
import { adminDb } from "../../lib/firestoreAdmin"; 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getUserData(uid) {
  if (!uid) return "";
  try {
    const snap = await adminDb.doc(`users/${uid}/data/main`).get();
    if (!snap.exists) return "";
    const d = snap.data();
    return d.formatted || d.raw || "";
  } catch (err) {
    console.error("Firestore getUserData error:", err);
    return "";
  }
}

async function getAiAccess(uid) {
  if (!uid) return "chatgpt";
  try {
    const snap = await adminDb.doc(`users/${uid}/data/main`).get();
    if (!snap.exists) return "chatgpt";
    const d = snap.data();
    switch (d.aiAccess) {
      case "data-only": return "data";
      case "chatgpt-only": return "chatgpt";
      case "both": 
      default: return "both";
    }
  } catch (err) {
    console.error("Firestore getAiAccess error:", err);
    return "chatgpt";
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, difficulty, numQuestions = 5, userId } = body;

    if (!topic) {
      return new Response(JSON.stringify({ error: "Missing topic" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" }
      });
    }

    const userData = await getUserData(userId);
    const aiAccess = await getAiAccess(userId);
    const finalMode = userData.trim() ? aiAccess : "chatgpt";

    let dataInstructions = "";
    if (finalMode === "data") dataInstructions = `Use ONLY the user-provided data.\n${userData}`;
    else if (finalMode === "both") dataInstructions = `Use the user-provided data first, fill gaps with ChatGPT.\n${userData}`;
    else dataInstructions = `Ignore user data. Use ONLY ChatGPT knowledge.`;

    const prompt = `
You are TestifyAI. Generate ${numQuestions} short-answer questions on "${topic}".
Difficulty: ${difficulty}.

${dataInstructions}

Rules:
1. Only output question text — no answers.
2. Output MUST be valid JSON like:
[ { "question": "string" } ]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices?.[0]?.message?.content?.trim() || "";
    content = content.replace(/```(json)?/g, "").trim();

    try {
      const questions = JSON.parse(content);
      return new Response(JSON.stringify({ questions }), { 
        headers: { "Content-Type": "application/json" }
      });
    } catch {
      return new Response(JSON.stringify({ error: "AI returned invalid JSON", raw: content }), { 
        status: 502, 
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (err) {
    console.error("Short-answer route error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" }
    });
  }
}
