import OpenAI from "openai";

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions, selectedTypes, answerCounts, typeQuestions } = await req.json();

    if (!selectedTypes || selectedTypes.length === 0) {
      return new Response(JSON.stringify({ error: "No test types selected." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Helper: call subroutes
    async function fetchQuestions(type) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/generate-test/${type}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic,
              difficulty,
              numQuestions: typeQuestions?.[type] || numQuestions,
              numAnswers: answerCounts?.[type] || (type === "multiple-choice" ? 4 : 5),
            }),
          }
        );
        if (!res.ok) {
          console.warn(`Subroute ${type} returned status ${res.status}`);
          return [];
        }
        const data = await res.json();
        if (data.questions) return data.questions.map((q) => ({ ...q, type }));
        if (data.question) return [{ ...data, type }];
        return [];
      } catch (err) {
        console.error(`Error fetching questions for type ${type}:`, err);
        return [];
      }
    }

    const results = await Promise.all(selectedTypes.map((t) => fetchQuestions(t)));
    const allQuestions = results.flat();

    // Group + order
    const objective = allQuestions.filter((q) =>
      ["multiple-choice", "multi-select", "true-false"].includes(q.type)
    );
    const openResponse = allQuestions.filter((q) => q.type === "open-response");
    const shortAnswer = allQuestions.filter((q) => q.type === "short-answer");

    // Shuffle objective
    for (let i = objective.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [objective[i], objective[j]] = [objective[j], objective[i]];
    }

    const finalQuestions = [...objective, ...openResponse, ...shortAnswer];

    return new Response(JSON.stringify({ questions: finalQuestions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error generating unified test:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
