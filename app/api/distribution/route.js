// app/api/distribution/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, difficulty, questionsPerType } = await req.json();

    if (!topic || !questionsPerType) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log("🧩 Distribution starting:", { topic, difficulty, questionsPerType });

    async function generateForType(type, count) {
      const endpoint = `/api/${type}`;
      console.log(`📡 Fetching ${count} x ${type} from ${endpoint}`);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty, numQuestions: count }),
        });

        const text = await res.text();
        console.log(`🔍 Raw ${type} response:`, text);

        if (!res.ok) {
          console.warn(`⚠️ ${type} endpoint returned status ${res.status}`);
          return [];
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.warn(`⚠️ Failed to parse JSON from ${type}, attempting extraction...`);
          // try to extract first JSON array/object in text
          const match = text.match(/(\[.*\]|\{.*\})/s);
          if (match) {
            try {
              data = JSON.parse(match[0]);
              // If data is an array, wrap to { questions: data } for backward compatibility
              if (Array.isArray(data)) data = { questions: data };
            } catch (e) {
              console.error(`❌ Still couldn't parse ${type} response`, e);
              return [];
            }
          } else {
            return [];
          }
        }

        // accept either { questions: [...] } or [...questions]
        const questions = data.questions ?? (Array.isArray(data) ? data : []);
        // normalize each question shape and add type
        return (questions || []).map((q, i) => ({
          id: q.id ?? `${type}-${i + 1}`,
          type,
          question: q.question ?? q.prompt ?? "",
          answers: q.answers ?? q.options ?? q.choices ?? undefined,
          correct: q.correct ?? q.answer ?? q.correctAnswer ?? undefined,
          explanation: q.explanation ?? q.explain ?? undefined,
          // preserve any other fields
          ...q,
        }));
      } catch (err) {
        console.error(`❌ Error fetching ${type}:`, err);
        return [];
      }
    }

    const allQuestions = [];
    for (const [type, count] of Object.entries(questionsPerType)) {
      const qset = await generateForType(type, count);
      if (qset.length === 0) {
        console.warn(`⚠️ No questions returned for ${type}`);
      }
      allQuestions.push(...qset);
    }

    if (allQuestions.length === 0) {
      console.warn("⚠️ Distribution produced 0 questions in total.");
    }

    return NextResponse.json({
      topic,
      difficulty,
      questions: allQuestions,
    });
  } catch (err) {
    console.error("❌ Distribution route failed:", err);
    return NextResponse.json({ error: "Distribution failed" }, { status: 500 });
  }
}
